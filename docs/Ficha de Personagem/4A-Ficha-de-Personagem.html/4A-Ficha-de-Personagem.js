document.addEventListener('DOMContentLoaded', () => {
    const profileCard = document.getElementById('profile-card');
    const profileToggle = document.getElementById('profile-toggle');
    const profileHeaderTitle = document.getElementById('profile-header-title');
    const dynamicResourcesContainer = document.getElementById('dynamic-resources-container');
    const xpCircleProgress = document.getElementById('xp-circle-progress');
    const xpBonusBarContainer = document.getElementById('xp-bonus-bar-container');
    const xpBonusBar = document.getElementById('xp-bonus-bar');
    const circumference = 2 * Math.PI * 68.5;

    function updateBar(barElement, current, max) {
        const percentage = Math.max(0, Math.min(100, (current / max) * 100));
        barElement.style.width = `${percentage}%`;
    }

    function updateHealthBar() {
        const currentHpEl = document.getElementById('hp-current');
        const maxHpEl = document.getElementById('hp-max');
        const healthBar = document.getElementById('health-bar');
        const currentHp = parseInt(currentHpEl.innerText) || 0;
        const maxHp = parseInt(maxHpEl.innerText) || 1;
        updateBar(healthBar, currentHp, maxHp);
    }

    function updateManaBar() {
        const currentMpEl = document.getElementById('mp-current');
        const maxMpEl = document.getElementById('mp-max');
        const manaBar = document.getElementById('mana-bar');
        const currentMp = parseInt(currentMpEl.innerText) || 0;
        const maxMp = parseInt(maxMpEl.innerText) || 1;
        updateBar(manaBar, currentMp, maxMp);
    }

    function updateXpBar() {
        const currentXpEl = document.getElementById('xp-current');
        const maxXpEl = document.getElementById('xp-max');
        const currentXpSideEl = document.getElementById('xp-current-side');
        const maxXpSideEl = document.getElementById('xp-max-side');
        const xpBarLinear = document.getElementById('xp-bar');
        let currentXp = parseInt(currentXpEl.innerText) || 0;
        let maxXp = parseInt(maxXpEl.innerText) || 1;
        let bonusXp = 0;
        if (currentXp > maxXp) {
            bonusXp = currentXp - maxXp;
            currentXp = maxXp;
            xpBonusBarContainer.classList.remove('hidden');
        } else {
            xpBonusBarContainer.classList.add('hidden');
        }
        currentXpSideEl.innerText = parseInt(currentXpEl.innerText) || 0;
        maxXpSideEl.innerText = maxXp;
        if (currentXp === maxXp && bonusXp > 0) {
            updateBar(xpBarLinear, 100, 100);
            updateBar(xpBonusBar, bonusXp, maxXp);
        } else {
            updateBar(xpBarLinear, currentXp, maxXp);
            updateBar(xpBonusBar, 0, maxXp);
        }
        const progress = (parseInt(currentXpEl.innerText) || 0) / maxXp;
        const offset = circumference * (1 - progress);
        xpCircleProgress.style.strokeDashoffset = offset;
    }

    function updateProfileHeaderTitle() {
        const charName = document.getElementById('char-name').innerText.trim();
        if (profileCard.classList.contains('compact-profile')) {
            profileHeaderTitle.innerText = charName.toUpperCase() || 'PERFIL';
        } else {
            profileHeaderTitle.innerText = 'PERFIL';
        }
    }

    function createResourceBar(title = 'Novo Recurso', current = 10, max = 10, color = '#67e8f9') {
        const resourceDiv = document.createElement('div');
        resourceDiv.className = 'space-y-2';
        const uniqueId = `resource-${Date.now()}`;
        resourceDiv.innerHTML = `
            <div class="flex justify-between items-center" style="height: 44px !important; background-color: rgba(0, 0, 0, 0.1)">
                <div contenteditable="true" class="status-title editable flex-1" data-id="${uniqueId}-title" style="padding-left: 0; flex: 10 2 0%; height: min-content;">${title}</div>
                <div style="flex: 1 1 0%; height: 100%; background-color: rgba(0, 0, 0, 0.1)"></div>
                <div class="flex items-center gap-2" style="height: 100%; background-color: rgba(0, 0, 0, 0.1)">
                    <div contenteditable="true" class="editable text-white bg-slate-700 rounded-md text-center w-10 p-0 text-lg" data-id="${uniqueId}-current">${current}</div>
                    <span class="text-lg">/</span>
                    <div contenteditable="true" class="editable text-white bg-slate-700 rounded-md text-center w-10 p-0 text-lg" data-id="${uniqueId}-max">${max}</div>
                </div>
                <button class="remove-resource-btn text-xl hover:text-red-400" data-id="${uniqueId}-remove" style="background-color: #1C2531; height: 100%;">×</button>
            </div>
            <div class="flex items-center gap-2" style="margin-top: calc(0.1rem * calc(1 - var(--tw-space-y-reverse)));">
                <div class="dynamic-bar-container flex-grow">
                    <div class="dynamic-bar" style="background-color: ${color};"></div>
                </div>
                <input type="color" class="color-dropper" value="${color}" data-id="${uniqueId}-color">
            </div>
        `;
        dynamicResourcesContainer.appendChild(resourceDiv);
        const titleEl = resourceDiv.querySelector(`[data-id="${uniqueId}-title"]`);
        const currentEl = resourceDiv.querySelector(`[data-id="${uniqueId}-current"]`);
        const maxEl = resourceDiv.querySelector(`[data-id="${uniqueId}-max"]`);
        const colorEl = resourceDiv.querySelector(`[data-id="${uniqueId}-color"]`);
        const barEl = resourceDiv.querySelector('.dynamic-bar');
        const removeBtn = resourceDiv.querySelector(`[data-id="${uniqueId}-remove"]`);
        const updateDynamicBar = () => {
            const currentVal = parseInt(currentEl.innerText) || 0;
            const maxVal = parseInt(maxEl.innerText) || 1;
            updateBar(barEl, currentVal, maxVal);
            saveData();
        };
        titleEl.addEventListener('input', saveData);
        currentEl.addEventListener('input', updateDynamicBar);
        maxEl.addEventListener('input', updateDynamicBar);
        colorEl.addEventListener('input', (event) => {
            barEl.style.backgroundColor = event.target.value;
            saveData();
        });
        removeBtn.addEventListener('click', () => {
            resourceDiv.remove();
            saveData();
        });
        updateDynamicBar();
    }

    function saveData() {
        const data = {};
        const editableElements = document.querySelectorAll('[contenteditable="true"]');
        editableElements.forEach(element => {
            if (element.id) {
                data[element.id] = element.innerHTML;
            }
        });
        const inventory = [];
        document.querySelectorAll('#inventory-body tr').forEach(row => {
            inventory.push({
                item: row.cells[0].innerText,
                qty: row.cells[1].innerText,
                weight: row.cells[2].innerText,
            });
        });
        data['inventory'] = inventory;
        const dynamicResources = [];
        dynamicResourcesContainer.querySelectorAll('.space-y-2').forEach(resourceDiv => {
            const title = resourceDiv.querySelector('.status-title').innerText;
            const current = resourceDiv.querySelector('[data-id*="-current"]').innerText;
            const max = resourceDiv.querySelector('[data-id*="-max"]').innerText;
            const color = resourceDiv.querySelector('input[type="color"]').value;
            dynamicResources.push({ title, current, max, color });
        });
        data['dynamicResources'] = dynamicResources;
        const avatarDiv = document.getElementById('avatar');
        if (avatarDiv.style.backgroundImage) {
            data['avatar-bg'] = avatarDiv.style.backgroundImage;
        }
        data['layout-compact'] = profileCard.classList.contains('compact-profile');
        localStorage.setItem('characterSheetDataV7', JSON.stringify(data));
    }

    function loadData() {
        const data = JSON.parse(localStorage.getItem('characterSheetDataV7'));
        if (!data) return;
        const editableElements = document.querySelectorAll('[contenteditable="true"]');
        editableElements.forEach(element => {
            if (element.id && data[element.id] !== undefined) {
                element.innerHTML = data[element.id];
            }
        });
        if (data.inventory) {
            const inventoryBody = document.getElementById('inventory-body');
            inventoryBody.innerHTML = '';
            data.inventory.forEach(itemData => createInventoryRow(itemData.item, itemData.qty, itemData.weight));
        }
        if (data.dynamicResources) {
            dynamicResourcesContainer.innerHTML = '';
            data.dynamicResources.forEach(resource => createResourceBar(resource.title, resource.current, resource.max, resource.color));
        }
        if (data['avatar-bg']) {
            const avatarDiv = document.getElementById('avatar');
            avatarDiv.style.backgroundImage = data['avatar-bg'];
            avatarDiv.innerHTML = '';
        }
        if (data['layout-compact']) {
            profileCard.classList.add('compact-profile');
            document.getElementById('xp-numbers-top').classList.add('hidden');
            document.getElementById('xp-numbers-side').classList.remove('hidden');
        } else {
            profileCard.classList.remove('compact-profile');
            document.getElementById('xp-numbers-top').classList.remove('hidden');
            document.getElementById('xp-numbers-side').classList.add('hidden');
        }
        updateHealthBar();
        updateManaBar();
        updateXpBar();
        updateProfileHeaderTitle();
    }

    function createInventoryRow(item = '', qty = '1', weight = '0') {
        const inventoryBody = document.getElementById('inventory-body');
        const row = document.createElement('tr');
        row.className = 'border-b border-slate-800';
        row.innerHTML = `
            <td class="p-2"><div contenteditable="true" class="editable">${item}</div></td>
            <td class="p-2 text-center"><div contenteditable="true" class="editable">${qty}</div></td>
            <td class="p-2"><div contenteditable="true" class="editable">${weight}</div></td>
            <td class="p-2 text-center"><button class="remove-item-btn text-lg hover:text-red-400">X</button></td>
        `;
        inventoryBody.appendChild(row);
        row.querySelector('.remove-item-btn').addEventListener('click', () => {
            row.remove();
            saveData();
        });
        row.querySelectorAll('[contenteditable]').forEach(el => el.addEventListener('input', saveData));
    }

    document.querySelectorAll('[contenteditable="true"]').forEach(element => {
        element.addEventListener('input', saveData);
    });
    document.getElementById('hp-current').addEventListener('input', updateHealthBar);
    document.getElementById('hp-max').addEventListener('input', updateHealthBar);
    document.getElementById('mp-current').addEventListener('input', updateManaBar);
    document.getElementById('mp-max').addEventListener('input', updateManaBar);
    document.getElementById('xp-current').addEventListener('input', updateXpBar);
    document.getElementById('xp-max').addEventListener('input', updateXpBar);
    document.getElementById('xp-current-side').addEventListener('input', updateXpBar);
    document.getElementById('xp-max-side').addEventListener('input', updateXpBar);
    document.getElementById('level').addEventListener('input', saveData);
    document.getElementById('char-race').addEventListener('input', saveData);
    document.getElementById('char-class').addEventListener('input', saveData);
    document.getElementById('char-age').addEventListener('input', saveData);
    document.getElementById('char-height').addEventListener('input', saveData);
    document.getElementById('char-powers').addEventListener('input', saveData);
    document.getElementById('char-name').addEventListener('input', updateProfileHeaderTitle);
    document.getElementById('add-resource-btn').addEventListener('click', () => createResourceBar());
    const avatarDiv = document.getElementById('avatar');
    const avatarInput = document.getElementById('avatar-input');
    avatarDiv.addEventListener('click', () => avatarInput.click());
    avatarInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                avatarDiv.style.backgroundImage = `url('${e.target.result}')`;
                avatarDiv.innerHTML = '';
                saveData();
            };
            reader.readAsDataURL(file);
        }
    });
    document.getElementById('add-item-btn').addEventListener('click', () => createInventoryRow());
    profileToggle.addEventListener('click', () => {
        profileCard.classList.toggle('compact-profile');
        const isCompact = profileCard.classList.contains('compact-profile');
        document.getElementById('xp-numbers-top').classList.toggle('hidden', isCompact);
        document.getElementById('xp-numbers-side').classList.toggle('hidden', !isCompact);
        updateProfileHeaderTitle();
        saveData();
    });
    loadData();
    updateHealthBar();
    updateManaBar();
    updateXpBar();
});