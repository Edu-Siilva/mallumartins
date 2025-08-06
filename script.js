// ===== CONFIGURAÇÕES - ALTERE AQUI =====
const CONFIG = {
    // ALTERE: Seu número do WhatsApp (com código do país)
    whatsapp: '5562981599970',
    
    // ALTERE: Nome do seu negócio
    businessName: 'Mallu Martins',
    
    // ALTERE: Seu nome profissional
    professionalName: 'Maria Luiza',
    
    // ALTERE: Horários disponíveis para agendamento
    availableHours: [
        '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
    ],
    
    // ALTERE: Dias da semana que funciona (0 = domingo, 6 = sábado)
    workingDays: [1, 2, 3, 4, 5, 6], // Segunda a sábado
    
    // ALTERE: Mensagem padrão do WhatsApp
    defaultMessage: 'Olá! Gostaria de agendar um horário para extensão de cílios.'
};

// ===== VARIÁVEIS GLOBAIS =====
let currentImageIndex = 0;
let selectedService = null;

// Array com as imagens da galeria
const galleryImages = [
    './fotostecnicas/1.jpeg',
    './fotostecnicas/2.jpeg',
    './fotostecnicas/3.jpeg',
    './fotostecnicas/4.jpeg',
    './fotostecnicas/5.jpeg',
    './fotostecnicas/6.jpeg'
];

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Configurar navegação
    setupNavigation();
    
    // Configurar scroll suave
    setupSmoothScroll();
    
    // Configurar todos os event listeners
    setupAllEventListeners();
    
    // Configurar formulário de agendamento
    setupBookingForm();
    
    // Configurar datas mínimas
    setupDateLimits();
    
    // Configurar animações de scroll
    setupScrollAnimations();
    
    // Configurar header fixo
    setupStickyHeader();
}

// ===== CONFIGURAÇÃO DE TODOS OS EVENT LISTENERS =====
function setupAllEventListeners() {
    // Botões de agendamento
    document.querySelectorAll('[data-action="booking"]').forEach(button => {
        button.addEventListener('click', openBooking);
    });
    
    // Botões de scroll
    document.querySelectorAll('[data-scroll]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.dataset.scroll;
            scrollToSection(target);
        });
    });
    
    // Botões de serviços
    document.querySelectorAll('[data-service]').forEach(button => {
        button.addEventListener('click', function() {
            const service = this.dataset.service;
            const price = this.dataset.price;
            const duration = this.dataset.duration;
            selectService(service, price, duration);
        });
    });

    // GALERIA - Event listeners corrigidos
    document.querySelectorAll('[data-lightbox]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const imageIndex = parseInt(this.dataset.lightbox);
            if (!isNaN(imageIndex)) {
                openLightbox(imageIndex);
            }
        });
    });

    // Botões de fechar modais
    document.querySelectorAll('[data-action="close-booking"]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            closeBooking();
        });
    });

    document.querySelectorAll('[data-action="close-lightbox"]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            closeLightbox();
        });
    });

    // Botões de navegação da galeria
    document.querySelectorAll('[data-action="next-image"]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            nextImage();
        });
    });

    document.querySelectorAll('[data-action="prev-image"]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            prevImage();
        });
    });
}

// ===== NAVEGAÇÃO =====
function setupNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navToggle || !navMenu) return;
    
    // Toggle menu mobile
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Alterar ícone
        const icon = navToggle.querySelector('i');
        if (icon) {
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // Fechar menu ao clicar em link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
}

// ===== SCROLL SUAVE =====
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Validar se o href é válido
            if (!targetId || targetId === '#') {
                return;
            }
            
            scrollToSection(targetId);
        });
    });
}

// ===== FUNÇÃO DE SCROLL PRINCIPAL - CORRIGIDA =====
function scrollToSection(target) {
    try {
        if (!target) {
            console.warn('Target de scroll não fornecido');
            return;
        }
        
        // Se receber um objeto (da função nativa scrollTo), ignorar
        if (typeof target === 'object') {
            console.warn('Objeto recebido no scroll, ignorando:', target);
            return;
        }
        
        // Garantir que o target é uma string
        const targetSelector = typeof target === 'string' ? target : target.toString();
        
        // Adicionar # se não tiver
        const selector = targetSelector.startsWith('#') ? targetSelector : '#' + targetSelector;
        
        let element = document.querySelector(selector);
        
        if (!element) {
            console.warn('Elemento não encontrado:', selector);
            
            // Tentar alternativas comuns para o caso de #booking
            if (selector === '#booking') {
                // Se não encontrar #booking, tentar abrir o modal
                openBooking();
                return;
            }
            
            // Outras alternativas
            const alternatives = ['#contact', '#services', '#about', '#gallery', '#home'];
            for (let alt of alternatives) {
                if (selector.includes(alt.substring(1))) {
                    const altElement = document.querySelector(alt);
                    if (altElement) {
                        console.log('Usando elemento alternativo:', alt);
                        element = altElement;
                        break;
                    }
                }
            }
            
            if (!element) return;
        }

        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = element.offsetTop - headerHeight - 20;
        
        // Usar a função nativa window.scrollTo
        window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth'
        });
    } catch (error) {
        console.error('Erro no scroll:', error);
        console.error('Target recebido:', target, typeof target);
    }
}

// ===== FUNÇÃO GLOBAL SCROLLTO REMOVIDA (conflito com nativa) =====
// Removida para evitar conflito com window.scrollTo() nativa

// ===== HEADER FIXO =====
function setupStickyHeader() {
    const header = document.getElementById('header');
    
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(15px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
    });
}

// ===== ANIMAÇÕES DE SCROLL =====
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos que devem animar
    const animatedElements = document.querySelectorAll('.service-card, .gallery-item, .contact-item, .credential-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== SELEÇÃO DE SERVIÇO =====
function selectService(serviceName, price, duration) {
    console.log('Serviço selecionado:', serviceName, price, duration);
    
    selectedService = {
        name: serviceName,
        price: price,
        duration: duration
    };
    
    // Abrir modal de agendamento
    openBooking();
    
    // Pré-selecionar serviço no formulário
    setTimeout(() => {
        const serviceSelect = document.getElementById('service-select');
        if (serviceSelect) {
            const optionText = `${serviceName} - R$ ${price}`;
            // Tentar encontrar a opção exata
            for (let option of serviceSelect.options) {
                if (option.text.includes(serviceName)) {
                    serviceSelect.value = option.value;
                    break;
                }
            }
        }
    }, 100);
}

// ===== MODAL DE AGENDAMENTO =====
function openBooking() {
    const modal = document.getElementById('booking-modal');
    if (!modal) return;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focar no primeiro campo
    setTimeout(() => {
        const firstInput = document.getElementById('client-name');
        if (firstInput) firstInput.focus();
    }, 300);
}

function closeBooking() {
    const modal = document.getElementById('booking-modal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Limpar formulário
    const form = document.getElementById('booking-form');
    if (form) form.reset();
    selectedService = null;
}

// ===== CONFIGURAÇÃO DO FORMULÁRIO =====
function setupBookingForm() {
    const form = document.getElementById('booking-form');
    const dateInput = document.getElementById('preferred-date');
    
    if (!form) return;
    
    form.addEventListener('submit', handleBookingSubmit);
    
    // Configurar máscara de telefone
    const phoneInput = document.getElementById('client-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                if (value.length < 14) {
                    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                }
            }
            
            e.target.value = value;
        });
    }
    
    // Validar data selecionada
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value + 'T00:00:00');
            const dayOfWeek = selectedDate.getDay();
            
            if (!CONFIG.workingDays.includes(dayOfWeek)) {
                alert('Desculpe, não atendemos neste dia da semana. Por favor, escolha outro dia.');
                this.value = '';
                return;
            }
            
            updateAvailableHours(selectedDate);
        });
    }
}

function setupDateLimits() {
    const dateInput = document.getElementById('preferred-date');
    if (!dateInput) return;
    
    const today = new Date();
    
    // Data mínima: amanhã
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Data máxima: 3 meses à frente
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 3);
    
    dateInput.min = tomorrow.toISOString().split('T')[0];
    dateInput.max = maxDate.toISOString().split('T')[0];
}

function updateAvailableHours(selectedDate) {
    const timeSelect = document.getElementById('preferred-time');
    if (!timeSelect) return;
    
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    const currentHour = today.getHours();
    
    // Limpar opções existentes
    timeSelect.innerHTML = '<option value="">Selecione um horário</option>';
    
    CONFIG.availableHours.forEach(hour => {
        const hourNumber = parseInt(hour.split(':')[0]);
        
        // Se for hoje, só mostrar horários futuros
        if (!isToday || hourNumber > currentHour + 1) {
            const option = document.createElement('option');
            option.value = hour;
            option.textContent = hour;
            timeSelect.appendChild(option);
        }
    });
}

// ===== ENVIO DO FORMULÁRIO =====
function handleBookingSubmit(e) {
    e.preventDefault();
    
    // Coletar dados do formulário
    const formData = {
        name: document.getElementById('client-name')?.value?.trim() || '',
        phone: document.getElementById('client-phone')?.value?.trim() || '',
        service: document.getElementById('service-select')?.value || '',
        date: document.getElementById('preferred-date')?.value || '',
        time: document.getElementById('preferred-time')?.value || '',
        observations: document.getElementById('observations')?.value?.trim() || ''
    };
    
    // Validar dados
    if (!validateBookingForm(formData)) {
        return;
    }
    
    // Gerar mensagem para WhatsApp
    const message = generateWhatsAppMessage(formData);
    
    // Abrir WhatsApp
    const whatsappUrl = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Fechar modal e mostrar confirmação
    closeBooking();
    showSuccessMessage();
}

function validateBookingForm(data) {
    if (!data.name) {
        alert('Por favor, informe seu nome completo.');
        const nameInput = document.getElementById('client-name');
        if (nameInput) nameInput.focus();
        return false;
    }
    
    if (!data.phone || data.phone.length < 14) {
        alert('Por favor, informe um número de WhatsApp válido.');
        const phoneInput = document.getElementById('client-phone');
        if (phoneInput) phoneInput.focus();
        return false;
    }
    
    if (!data.service) {
        alert('Por favor, selecione um serviço.');
        const serviceSelect = document.getElementById('service-select');
        if (serviceSelect) serviceSelect.focus();
        return false;
    }
    
    if (!data.date) {
        alert('Por favor, selecione uma data.');
        const dateInput = document.getElementById('preferred-date');
        if (dateInput) dateInput.focus();
        return false;
    }
    
    if (!data.time) {
        alert('Por favor, selecione um horário.');
        const timeSelect = document.getElementById('preferred-time');
        if (timeSelect) timeSelect.focus();
        return false;
    }
    
    return true;
}

function generateWhatsAppMessage(data) {
    const date = new Date(data.date + 'T00:00:00');
    const formattedDate = date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    let message = `🌟 *Solicitação de Agendamento* 🌟\n\n`;
    message += `👤 *Nome:* ${data.name}\n`;
    message += `📱 *WhatsApp:* ${data.phone}\n`;
    message += `💅 *Serviço:* ${data.service}\n`;
    message += `📅 *Data:* ${formattedDate}\n`;
    message += `⏰ *Horário:* ${data.time}\n`;
    
    if (data.observations) {
        message += `📝 *Observações:* ${data.observations}\n`;
    }
    
    message += `\n✨ Aguardo confirmação do agendamento!`;
    
    return message;
}

function showSuccessMessage() {
    // Criar elemento de sucesso
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #e91e63, #9c27b0);
        color: white;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        text-align: center;
        z-index: 3000;
        max-width: 400px;
        width: 90%;
    `;
    
    successDiv.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
        <h3 style="margin-bottom: 1rem; font-family: 'Playfair Display', serif;">Agendamento Enviado!</h3>
        <p>Sua solicitação foi enviada via WhatsApp. Responderemos em breve para confirmar seu horário.</p>
    `;
    
    document.body.appendChild(successDiv);
    
    // Remover após 4 segundos
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 4000);
}

// ===== GALERIA E LIGHTBOX - CORRIGIDOS =====
function openLightbox(imageIndex) {
    currentImageIndex = imageIndex;
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    updateLightboxImage();
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function nextImage() {
    const totalImages = galleryImages.length;
    currentImageIndex = (currentImageIndex + 1) % totalImages;
    updateLightboxImage();
}

function prevImage() {
    const totalImages = galleryImages.length;
    currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
    updateLightboxImage();
}

function updateLightboxImage() {
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightboxImg && galleryImages[currentImageIndex]) {
        lightboxImg.src = galleryImages[currentImageIndex];
        lightboxImg.alt = `Trabalho ${currentImageIndex + 1}`;
    }
}

// ===== EVENTOS DE TECLADO =====
document.addEventListener('keydown', function(e) {
    // Fechar modal com ESC
    if (e.key === 'Escape') {
        const bookingModal = document.getElementById('booking-modal');
        const lightbox = document.getElementById('lightbox');
        
        if (bookingModal && bookingModal.classList.contains('active')) {
            closeBooking();
        }
        
        if (lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    }
    
    // Navegação na galeria
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    }
});

// ===== CLICKS FORA DOS MODAIS =====
document.addEventListener('click', function(e) {
    // Fechar modal de agendamento
    const bookingModal = document.getElementById('booking-modal');
    if (bookingModal && e.target === bookingModal) {
        closeBooking();
    }
    
    // Fechar lightbox
    const lightbox = document.getElementById('lightbox');
    if (lightbox && e.target === lightbox) {
        closeLightbox();
    }
});

// ===== TRATAMENTO DE ERROS =====
window.addEventListener('error', function(e) {
    console.error('Erro na aplicação:', e.error);
    
    // Não mostrar alert para não incomodar o usuário
    // Se necessário, implementar notificação discreta
});

// ===== FUNÇÕES AUXILIARES =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== OTIMIZAÇÃO DE SCROLL =====
const optimizedScrollHandler = throttle(function() {
    setupStickyHeader();
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// ===== DETECTAR DISPOSITIVO MÓVEL =====
function isMobile() {
    return window.innerWidth <= 768;
}

// ===== AJUSTES RESPONSIVOS =====
window.addEventListener('resize', debounce(function() {
    if (isMobile()) {
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
    }
}, 250));

// ===== LOADING STATE =====
function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'loading';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255,255,255,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    
    loader.innerHTML = `
        <div style="text-align: center;">
            <div style="width: 50px; height: 50px; border: 3px solid #e91e63; border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite;"></div>
            <p style="margin-top: 1rem; color: #6c757d;">Carregando...</p>
        </div>
    `;
    
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.getElementById('loading');
    if (loader) {
        loader.remove();
    }
}

// ===== INICIALIZAÇÃO FINAL =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// ===== CSS ANIMATIONS INLINE =====
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);