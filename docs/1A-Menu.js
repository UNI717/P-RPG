tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        primary: '#1E1E2F',
                        secondary: '#28283D',
                        accent: '#262626',
                        highlight: '#0F0F0F',
                        textLight: '#F0F0F0',
                        textDark: '#333333',
                        icon: '#9CA3AF',
                        activeIcon: '#E5E7EB',
                        activeBg: '#1B1B1B',
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    },
                    animation: {
                        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    }
                }
            }
        }


document.addEventListener('DOMContentLoaded', () => {
            const sidebar = document.getElementById('sidebar');
            const sidebarHeader = document.getElementById('sidebar-header');
            const mainContent = document.querySelector('main');
            
            // Larguras base e de colapso da barra lateral
            const expandedWidthClass = 'w-64';
            const collapsedWidthClass = 'w-25'; // Alterado para a nova classe personalizada

            // Lógica para o botão de colapsar a barra lateral
            sidebarHeader.addEventListener('click', () => {
                // Adiciona ou remove a classe que gerencia o estado colapsado
                sidebar.classList.toggle('sidebar-collapsed');

                // Alterna as classes de largura do Tailwind na barra lateral
                if (sidebar.classList.contains('sidebar-collapsed')) {
                    sidebar.classList.remove(expandedWidthClass);
                    sidebar.classList.add(collapsedWidthClass);
                } else {
                    sidebar.classList.remove(collapsedWidthClass);
                    sidebar.classList.add(expandedWidthClass);
                }
            });

            // Lógica para o novo botão dinâmico de alternar o tema (Sol/Lua)
            const themeToggle = document.getElementById('theme-toggle');
            const sunIcon = document.getElementById('theme-icon-sun');
            const moonIcon = document.getElementById('theme-icon-moon');
            
            const applyTheme = (theme) => {
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    sunIcon.classList.remove('hidden');
                    moonIcon.classList.add('hidden');
                } else {
                    document.documentElement.classList.remove('dark');
                    sunIcon.classList.add('hidden');
                    moonIcon.classList.remove('hidden');
                }
            };

            const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            applyTheme(savedTheme);

            themeToggle.addEventListener('click', () => {
                const isDark = document.documentElement.classList.toggle('dark');
                const newTheme = isDark ? 'dark' : 'light';
                localStorage.setItem('theme', newTheme);
                applyTheme(newTheme);
            });
        });

document.addEventListener("DOMContentLoaded", () => {
    const botoes = document.querySelectorAll(".sidebar-item");
    const secoes = {
        "btn-personagens": "conteudo-personagens",
        "btn-elementos": "conteudo-elementos"
        // depois pode adicionar Inventário etc.
    };

    botoes.forEach(botao => {
        botao.addEventListener("click", e => {
            e.preventDefault();

            // Remove destaque de todos os botões
            botoes.forEach(b => {
                b.classList.remove("bg-highlight");
                b.querySelector("svg").classList.remove("text-activeIcon");
                b.querySelector("span").classList.remove("text-activeIcon");
                b.querySelector("svg").classList.add("text-icon");
                b.querySelector("span").classList.add("text-icon");
            });

            // Esconde todos os conteúdos
            Object.values(secoes).forEach(id => {
                document.getElementById(id)?.classList.add("hidden");
            });

            // Ativa o botão clicado
            botao.classList.add("bg-highlight");
            botao.querySelector("svg").classList.add("text-activeIcon");
            botao.querySelector("span").classList.add("text-activeIcon");

            // Mostra o conteúdo correspondente
            const idSecao = secoes[botao.id];
            if (idSecao) {
                document.getElementById("conteudo-padrao").classList.add("hidden");
                document.getElementById(idSecao).classList.remove("hidden");
            }
        });
    });
});