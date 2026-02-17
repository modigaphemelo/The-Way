// The Way · Navigation and Progress Script
(function() {
    'use strict';

    // ==============================================
    // Mobile Navigation Toggle
    // ==============================================
    const navToggle = document.getElementById('navToggle');
    const sidebar = document.getElementById('sidebar');

    if (navToggle && sidebar) {
        // Toggle sidebar open/close
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            sidebar.classList.toggle('open');
            
            // Update aria-expanded attribute for accessibility
            const isOpen = sidebar.classList.contains('open');
            navToggle.setAttribute('aria-expanded', isOpen);
            
            // Prevent body scroll when sidebar is open on mobile
            if (window.innerWidth <= 1024) {
                document.body.style.overflow = isOpen ? 'hidden' : '';
            }
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (sidebar.classList.contains('open') && 
                !sidebar.contains(e.target) && 
                !navToggle.contains(e.target)) {
                sidebar.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                
                // Restore body scroll
                if (window.innerWidth <= 1024) {
                    document.body.style.overflow = '';
                }
            }
        });

        // Close sidebar on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                
                // Restore body scroll
                if (window.innerWidth <= 1024) {
                    document.body.style.overflow = '';
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 1024 && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // ==============================================
    // Reading Progress Bar
    // ==============================================
    const progressFill = document.getElementById('progressFill');

    if (progressFill) {
        function updateProgress() {
            const winScroll = window.scrollY;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (winScroll / height) * 100;
            progressFill.style.width = scrolled + '%';
            
            // Add or remove visible class based on scroll position
            const progress = document.querySelector('.progress');
            if (progress) {
                if (winScroll > 100) {
                    progress.style.opacity = '1';
                    progress.style.visibility = 'visible';
                } else {
                    progress.style.opacity = '0';
                    progress.style.visibility = 'hidden';
                }
            }
        }

        // Throttle scroll events for performance
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    updateProgress();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Initial call
        updateProgress();
    }

    // ==============================================
    // Smooth Scroll for Anchor Links
    // ==============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ==============================================
    // Active Navigation Highlighting
    // ==============================================
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            
            // Remove relative path indicators for comparison
            const cleanCurrent = currentPath.replace(/^.*[\\\/]/, '');
            const cleanLink = linkPath.replace(/^.*[\\\/]/, '');
            
            if (cleanCurrent === cleanLink || 
                (cleanLink === 'index.html' && cleanCurrent === '')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Call on load
    setActiveNavLink();

    // ==============================================
    // Fade In Animations on Scroll
    // ==============================================
    const animatedElements = document.querySelectorAll(
        '.pillar, .counterfeit-card, .sequence-box, .process-step, .path-step, .characteristic, .card, .simple-box, .note, .invitation-card'
    );

    if (animatedElements.length > 0) {
        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    fadeInObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            fadeInObserver.observe(el);
        });
    }

    // ==============================================
    // Copy Code Block Functionality
    // ==============================================
    document.querySelectorAll('.code-block').forEach(block => {
        const copyButton = document.createElement('button');
        copyButton.className = 'code-copy-button';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.setAttribute('aria-label', 'Copy code');
        
        copyButton.addEventListener('click', async () => {
            const code = block.querySelector('code').innerText;
            try {
                await navigator.clipboard.writeText(code);
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                copyButton.style.color = 'var(--path-primary)';
                
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    copyButton.style.color = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
                copyButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
                
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            }
        });
        
        block.style.position = 'relative';
        block.appendChild(copyButton);
    });

    // ==============================================
    // Table of Contents Generation
    // ==============================================
    const tocContainer = document.getElementById('toc');
    if (tocContainer) {
        const headings = document.querySelectorAll('.article-section h3, .article-section h4');
        const toc = document.createElement('ul');
        toc.className = 'toc-list';
        
        headings.forEach((heading, index) => {
            if (!heading.id) {
                heading.id = `heading-${index}`;
            }
            
            const item = document.createElement('li');
            item.className = 'toc-item';
            
            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent;
            
            if (heading.tagName === 'H4') {
                item.classList.add('toc-subitem');
            }
            
            item.appendChild(link);
            toc.appendChild(item);
        });
        
        tocContainer.appendChild(toc);
    }

    // ==============================================
    // Keyboard Navigation
    // ==============================================
    document.addEventListener('keydown', function(e) {
        // Left arrow - previous page
        if (e.key === 'ArrowLeft' && !e.ctrlKey && !e.metaKey) {
            const prevLink = document.querySelector('.nav-link-backward');
            if (prevLink && prevLink.href) {
                e.preventDefault();
                window.location.href = prevLink.href;
            }
        }
        
        // Right arrow - next page
        if (e.key === 'ArrowRight' && !e.ctrlKey && !e.metaKey) {
            const nextLink = document.querySelector('.nav-link-forward');
            if (nextLink && nextLink.href) {
                e.preventDefault();
                window.location.href = nextLink.href;
            }
        }
        
        // ? key - show help
        if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            showKeyboardHelp();
        }
    });

    function showKeyboardHelp() {
        const helpDiv = document.createElement('div');
        helpDiv.className = 'keyboard-help';
        helpDiv.innerHTML = `
            <div class="keyboard-help-content">
                <h3>Keyboard Navigation</h3>
                <ul>
                    <li><span class="key">←</span> Previous page</li>
                    <li><span class="key">→</span> Next page</li>
                    <li><span class="key">?</span> Show this help</li>
                    <li><span class="key">ESC</span> Close menu / help</li>
                </ul>
                <button class="close-help">Close</button>
            </div>
        `;
        
        document.body.appendChild(helpDiv);
        
        setTimeout(() => {
            helpDiv.classList.add('visible');
        }, 10);
        
        const closeBtn = helpDiv.querySelector('.close-help');
        closeBtn.addEventListener('click', () => {
            helpDiv.classList.remove('visible');
            setTimeout(() => {
                helpDiv.remove();
            }, 300);
        });
        
        helpDiv.addEventListener('click', (e) => {
            if (e.target === helpDiv) {
                helpDiv.classList.remove('visible');
                setTimeout(() => {
                    helpDiv.remove();
                }, 300);
            }
        });
    }

    // ==============================================
    // Print Styles Helper
    // ==============================================
    const printButton = document.getElementById('printButton');
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }

    // ==============================================
    // Dark/Light Mode Toggle (if implemented)
    // ==============================================
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            themeToggle.setAttribute('aria-pressed', isLight);
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            themeToggle.setAttribute('aria-pressed', 'true');
        }
    }

})();
