/**
 * CallPaste - Minimalist Pastebin for Phone Numbers
 * Main Application JavaScript
 */

// DOM Elements
const elements = {
    contentInput: document.getElementById('content-input'),
    prefixInput: document.getElementById('prefix-input'),
    btnAddPrefix: document.getElementById('btn-add-prefix'),
    btnRemovePrefix: document.getElementById('btn-remove-prefix'),
    btnNumberLines: document.getElementById('btn-number-lines'),
    btnGenerate: document.getElementById('btn-generate'),
    btnClear: document.getElementById('btn-clear'),
    previewContainer: document.getElementById('preview-container'),
    previewSection: document.getElementById('preview-section'),
    shareSection: document.getElementById('share-section'),
    lineCount: document.getElementById('line-count'),
    btnWhatsapp: document.getElementById('btn-whatsapp'),
    btnTelegram: document.getElementById('btn-telegram'),
    btnCopy: document.getElementById('btn-copy'),
    btnDownloadQr: document.getElementById('btn-download-qr'),
    qrCode: document.getElementById('qr-code'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message'),
    themeToggle: document.getElementById('theme-toggle')
};

// State
let currentContent = '';
let generatedPageId = null;

// Country codes dictionary (sorted by length for proper matching)
const countryCodes = {
    // North America
    '1': { name: 'Estados Unidos/Canadá', flag: '🇺🇸' },
    // Caribbean & Central America
    '1809': { name: 'República Dominicana', flag: '🇩🇴' },
    '1829': { name: 'República Dominicana', flag: '🇩🇴' },
    '1849': { name: 'República Dominicana', flag: '🇩🇴' },
    '1787': { name: 'Puerto Rico', flag: '🇵🇷' },
    '1939': { name: 'Puerto Rico', flag: '🇵🇷' },
    '1876': { name: 'Jamaica', flag: '🇯🇲' },
    '1868': { name: 'Trinidad y Tobago', flag: '🇹🇹' },
    '1246': { name: 'Barbados', flag: '🇧🇧' },
    '1242': { name: 'Bahamas', flag: '🇧🇸' },
    '1345': { name: 'Islas Caimán', flag: '🇰🇾' },
    '1441': { name: 'Bermudas', flag: '🇧🇲' },
    '1473': { name: 'Granada', flag: '🇬🇩' },
    '1649': { name: 'Islas Turcas y Caicos', flag: '🇹🇨' },
    '1664': { name: 'Montserrat', flag: '🇲🇸' },
    '1670': { name: 'Islas Marianas', flag: '🇲🇵' },
    '1671': { name: 'Guam', flag: '🇬🇺' },
    '1684': { name: 'Samoa Americana', flag: '🇦🇸' },
    '1721': { name: 'Sint Maarten', flag: '🇸🇽' },
    '1758': { name: 'Santa Lucía', flag: '🇱🇨' },
    '1767': { name: 'Dominica', flag: '🇩🇲' },
    '1784': { name: 'San Vicente', flag: '🇻🇨' },
    '1869': { name: 'San Cristóbal y Nieves', flag: '🇰🇳' },
    '1284': { name: 'Islas Vírgenes Británicas', flag: '🇻🇬' },
    '1340': { name: 'Islas Vírgenes EEUU', flag: '🇻🇮' },
    // South America  
    '54': { name: 'Argentina', flag: '🇦🇷' },
    '55': { name: 'Brasil', flag: '🇧🇷' },
    '56': { name: 'Chile', flag: '🇨🇱' },
    '57': { name: 'Colombia', flag: '🇨🇴' },
    '58': { name: 'Venezuela', flag: '🇻🇪' },
    '51': { name: 'Perú', flag: '🇵🇪' },
    '52': { name: 'México', flag: '🇲🇽' },
    '53': { name: 'Cuba', flag: '🇨🇺' },
    '591': { name: 'Bolivia', flag: '🇧🇴' },
    '592': { name: 'Guyana', flag: '🇬🇾' },
    '593': { name: 'Ecuador', flag: '🇪🇨' },
    '594': { name: 'Guyana Francesa', flag: '🇬🇫' },
    '595': { name: 'Paraguay', flag: '🇵🇾' },
    '597': { name: 'Surinam', flag: '🇸🇷' },
    '598': { name: 'Uruguay', flag: '🇺🇾' },
    // Central America
    '501': { name: 'Belice', flag: '🇧🇿' },
    '502': { name: 'Guatemala', flag: '🇬🇹' },
    '503': { name: 'El Salvador', flag: '🇸🇻' },
    '504': { name: 'Honduras', flag: '🇭🇳' },
    '505': { name: 'Nicaragua', flag: '🇳🇮' },
    '506': { name: 'Costa Rica', flag: '🇨🇷' },
    '507': { name: 'Panamá', flag: '🇵🇦' },
    '509': { name: 'Haití', flag: '🇭🇹' },
    // Europe
    '30': { name: 'Grecia', flag: '🇬🇷' },
    '31': { name: 'Países Bajos', flag: '🇳🇱' },
    '32': { name: 'Bélgica', flag: '🇧🇪' },
    '33': { name: 'Francia', flag: '🇫🇷' },
    '34': { name: 'España', flag: '🇪🇸' },
    '36': { name: 'Hungría', flag: '🇭🇺' },
    '37': { name: 'Lituania', flag: '🇱🇹' },
    '39': { name: 'Italia', flag: '🇮🇹' },
    '40': { name: 'Rumania', flag: '🇷🇴' },
    '41': { name: 'Suiza', flag: '🇨🇭' },
    '43': { name: 'Austria', flag: '🇦🇹' },
    '44': { name: 'Reino Unido', flag: '🇬🇧' },
    '45': { name: 'Dinamarca', flag: '🇩🇰' },
    '46': { name: 'Suecia', flag: '🇸🇪' },
    '47': { name: 'Noruega', flag: '🇳🇴' },
    '48': { name: 'Polonia', flag: '🇵🇱' },
    '49': { name: 'Alemania', flag: '🇩🇪' },
    '350': { name: 'Gibraltar', flag: '🇬🇮' },
    '351': { name: 'Portugal', flag: '🇵🇹' },
    '352': { name: 'Luxemburgo', flag: '🇱🇺' },
    '353': { name: 'Irlanda', flag: '🇮🇪' },
    '354': { name: 'Islandia', flag: '🇮🇸' },
    '355': { name: 'Albania', flag: '🇦🇱' },
    '356': { name: 'Malta', flag: '🇲🇹' },
    '357': { name: 'Chipre', flag: '🇨🇾' },
    '358': { name: 'Finlandia', flag: '🇫🇮' },
    '359': { name: 'Bulgaria', flag: '🇧🇬' },
    '370': { name: 'Lituania', flag: '🇱🇹' },
    '371': { name: 'Letonia', flag: '🇱🇻' },
    '372': { name: 'Estonia', flag: '🇪🇪' },
    '373': { name: 'Moldavia', flag: '🇲🇩' },
    '374': { name: 'Armenia', flag: '🇦🇲' },
    '375': { name: 'Bielorrusia', flag: '🇧🇾' },
    '376': { name: 'Andorra', flag: '🇦🇩' },
    '377': { name: 'Mónaco', flag: '🇲🇨' },
    '378': { name: 'San Marino', flag: '🇸🇲' },
    '380': { name: 'Ucrania', flag: '🇺🇦' },
    '381': { name: 'Serbia', flag: '🇷🇸' },
    '382': { name: 'Montenegro', flag: '🇲🇪' },
    '383': { name: 'Kosovo', flag: '🇽🇰' },
    '385': { name: 'Croacia', flag: '🇭🇷' },
    '386': { name: 'Eslovenia', flag: '🇸🇮' },
    '387': { name: 'Bosnia', flag: '🇧🇦' },
    '389': { name: 'Macedonia del Norte', flag: '🇲🇰' },
    '420': { name: 'Chequia', flag: '🇨🇿' },
    '421': { name: 'Eslovaquia', flag: '🇸🇰' },
    // Asia
    '7': { name: 'Rusia/Kazajistán', flag: '🇷🇺' },
    '60': { name: 'Malasia', flag: '🇲🇾' },
    '61': { name: 'Australia', flag: '🇦🇺' },
    '62': { name: 'Indonesia', flag: '🇮🇩' },
    '63': { name: 'Filipinas', flag: '🇵🇭' },
    '64': { name: 'Nueva Zelanda', flag: '🇳🇿' },
    '65': { name: 'Singapur', flag: '🇸🇬' },
    '66': { name: 'Tailandia', flag: '🇹🇭' },
    '81': { name: 'Japón', flag: '🇯🇵' },
    '82': { name: 'Corea del Sur', flag: '🇰🇷' },
    '84': { name: 'Vietnam', flag: '🇻🇳' },
    '86': { name: 'China', flag: '🇨🇳' },
    '90': { name: 'Turquía', flag: '🇹🇷' },
    '91': { name: 'India', flag: '🇮🇳' },
    '92': { name: 'Pakistán', flag: '🇵🇰' },
    '93': { name: 'Afganistán', flag: '🇦🇫' },
    '94': { name: 'Sri Lanka', flag: '🇱🇰' },
    '95': { name: 'Myanmar', flag: '🇲🇲' },
    '98': { name: 'Irán', flag: '🇮🇷' },
    '852': { name: 'Hong Kong', flag: '🇭🇰' },
    '853': { name: 'Macao', flag: '🇲🇴' },
    '855': { name: 'Camboya', flag: '🇰🇭' },
    '856': { name: 'Laos', flag: '🇱🇦' },
    '880': { name: 'Bangladesh', flag: '🇧🇩' },
    '886': { name: 'Taiwán', flag: '🇹🇼' },
    // Middle East
    '962': { name: 'Jordania', flag: '🇯🇴' },
    '963': { name: 'Siria', flag: '🇸🇾' },
    '964': { name: 'Irak', flag: '🇮🇶' },
    '965': { name: 'Kuwait', flag: '🇰🇼' },
    '966': { name: 'Arabia Saudita', flag: '🇸🇦' },
    '967': { name: 'Yemen', flag: '🇾🇪' },
    '968': { name: 'Omán', flag: '🇴🇲' },
    '970': { name: 'Palestina', flag: '🇵🇸' },
    '971': { name: 'Emiratos Árabes', flag: '🇦🇪' },
    '972': { name: 'Israel', flag: '🇮🇱' },
    '973': { name: 'Baréin', flag: '🇧🇭' },
    '974': { name: 'Catar', flag: '🇶🇦' },
    '975': { name: 'Bután', flag: '🇧🇹' },
    '976': { name: 'Mongolia', flag: '🇲🇳' },
    '977': { name: 'Nepal', flag: '🇳🇵' },
    // Africa
    '20': { name: 'Egipto', flag: '🇪🇬' },
    '27': { name: 'Sudáfrica', flag: '🇿🇦' },
    '211': { name: 'Sudán del Sur', flag: '🇸🇸' },
    '212': { name: 'Marruecos', flag: '🇲🇦' },
    '213': { name: 'Argelia', flag: '🇩🇿' },
    '216': { name: 'Túnez', flag: '🇹🇳' },
    '218': { name: 'Libia', flag: '🇱🇾' },
    '220': { name: 'Gambia', flag: '🇬🇲' },
    '221': { name: 'Senegal', flag: '🇸🇳' },
    '222': { name: 'Mauritania', flag: '🇲🇷' },
    '223': { name: 'Malí', flag: '🇲🇱' },
    '224': { name: 'Guinea', flag: '🇬🇳' },
    '225': { name: 'Costa de Marfil', flag: '🇨🇮' },
    '226': { name: 'Burkina Faso', flag: '🇧🇫' },
    '227': { name: 'Níger', flag: '🇳🇪' },
    '228': { name: 'Togo', flag: '🇹🇬' },
    '229': { name: 'Benín', flag: '🇧🇯' },
    '230': { name: 'Mauricio', flag: '🇲🇺' },
    '231': { name: 'Liberia', flag: '🇱🇷' },
    '232': { name: 'Sierra Leona', flag: '🇸🇱' },
    '233': { name: 'Ghana', flag: '🇬🇭' },
    '234': { name: 'Nigeria', flag: '🇳🇬' },
    '235': { name: 'Chad', flag: '🇹🇩' },
    '236': { name: 'Rep. Centroafricana', flag: '🇨🇫' },
    '237': { name: 'Camerún', flag: '🇨🇲' },
    '238': { name: 'Cabo Verde', flag: '🇨🇻' },
    '239': { name: 'Santo Tomé', flag: '🇸🇹' },
    '240': { name: 'Guinea Ecuatorial', flag: '🇬🇶' },
    '241': { name: 'Gabón', flag: '🇬🇦' },
    '242': { name: 'Congo', flag: '🇨🇬' },
    '243': { name: 'RD Congo', flag: '🇨🇩' },
    '244': { name: 'Angola', flag: '🇦🇴' },
    '245': { name: 'Guinea-Bisáu', flag: '🇬🇼' },
    '246': { name: 'Diego García', flag: '🇮🇴' },
    '247': { name: 'Ascensión', flag: '🇦🇨' },
    '248': { name: 'Seychelles', flag: '🇸🇨' },
    '249': { name: 'Sudán', flag: '🇸🇩' },
    '250': { name: 'Ruanda', flag: '🇷🇼' },
    '251': { name: 'Etiopía', flag: '🇪🇹' },
    '252': { name: 'Somalia', flag: '🇸🇴' },
    '253': { name: 'Yibuti', flag: '🇩🇯' },
    '254': { name: 'Kenia', flag: '🇰🇪' },
    '255': { name: 'Tanzania', flag: '🇹🇿' },
    '256': { name: 'Uganda', flag: '🇺🇬' },
    '257': { name: 'Burundi', flag: '🇧🇮' },
    '258': { name: 'Mozambique', flag: '🇲🇿' },
    '260': { name: 'Zambia', flag: '🇿🇲' },
    '261': { name: 'Madagascar', flag: '🇲🇬' },
    '262': { name: 'Reunión', flag: '🇷🇪' },
    '263': { name: 'Zimbabue', flag: '🇿🇼' },
    '264': { name: 'Namibia', flag: '🇳🇦' },
    '265': { name: 'Malaui', flag: '🇲🇼' },
    '266': { name: 'Lesoto', flag: '🇱🇸' },
    '267': { name: 'Botsuana', flag: '🇧🇼' },
    '268': { name: 'Esuatini', flag: '🇸🇿' },
    '269': { name: 'Comoras', flag: '🇰🇲' },
    '290': { name: 'Santa Elena', flag: '🇸🇭' },
    '291': { name: 'Eritrea', flag: '🇪🇷' },
    '297': { name: 'Aruba', flag: '🇦🇼' },
    '298': { name: 'Islas Feroe', flag: '🇫🇴' },
    '299': { name: 'Groenlandia', flag: '🇬🇱' },
};

/**
 * Show toast notification
 */
function showToast(message) {
    elements.toastMessage.textContent = message;
    elements.toast.classList.add('show');

    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 2000);
}

/**
 * Get lines from textarea
 */
function getLines() {
    return elements.contentInput.value.split('\n').filter(line => line.trim() !== '');
}

/**
 * Set lines to textarea
 */
function setLines(lines) {
    elements.contentInput.value = lines.join('\n');
    updateLineCount();
}

/**
 * Update line count badge
 */
function updateLineCount() {
    const lines = getLines();
    elements.lineCount.textContent = `${lines.length} línea${lines.length !== 1 ? 's' : ''}`;
}

/**
 * Check if string is a phone number
 */
function isPhoneNumber(str) {
    // Remove common phone formatting characters
    const cleaned = str.replace(/[\s\-\(\)\+\.]/g, '');
    // Check if it's mostly digits (at least 7 digits for a phone number)
    const digitCount = (cleaned.match(/\d/g) || []).length;
    return digitCount >= 7 && digitCount <= 15 && /^[\d\+\-\(\)\s\.]+$/.test(str.trim());
}

/**
 * Format phone number for tel: link
 */
function formatPhoneForLink(phone) {
    // Remove all non-digit characters except +
    return phone.replace(/[^\d\+]/g, '');
}

/**
 * Get country info from phone number based on prefix
 */
function getCountryFromPhone(phone) {
    // Clean the phone number - remove everything except digits
    let cleaned = phone.replace(/[^\d]/g, '');

    // If starts with +, handle it
    if (phone.startsWith('+')) {
        cleaned = phone.replace(/[^\d]/g, '');
    }

    // Try matching from longest prefix to shortest (4 digits down to 1)
    // This ensures we match specific codes like 1809 (Dominican Republic) before 1 (USA)
    for (let length = 4; length >= 1; length--) {
        const prefix = cleaned.substring(0, length);
        if (countryCodes[prefix]) {
            return countryCodes[prefix];
        }
    }

    return null; // No country found
}

/**
 * Add prefix to all lines
 */
function addPrefix() {
    const prefix = elements.prefixInput.value;
    if (!prefix) {
        showToast('Ingresa un prefijo');
        return;
    }

    const lines = getLines();
    if (lines.length === 0) {
        showToast('Sin contenido');
        return;
    }

    const newLines = lines.map(line => `${prefix}${line}`);
    setLines(newLines);
    showToast(`Prefijo agregado`);
}

/**
 * Remove prefix from all lines
 */
function removePrefix() {
    const prefix = elements.prefixInput.value;
    if (!prefix) {
        showToast('Ingresa un prefijo');
        return;
    }

    const lines = getLines();
    if (lines.length === 0) {
        showToast('Sin contenido');
        return;
    }

    const newLines = lines.map(line => {
        if (line.startsWith(prefix)) {
            return line.slice(prefix.length);
        }
        return line;
    });
    setLines(newLines);
    showToast(`Prefijo removido`);
}

/**
 * Add line numbers to all lines
 */
function numberLines() {
    const lines = getLines();
    if (lines.length === 0) {
        showToast('Sin contenido');
        return;
    }

    const newLines = lines.map((line, index) => `${index + 1}. ${line}`);
    setLines(newLines);
    showToast('Numerado');
}

/**
 * Generate the preview with clickable phone links
 */
function generatePreview() {
    const lines = getLines();

    if (lines.length === 0) {
        showToast('Sin contenido');
        return;
    }

    currentContent = elements.contentInput.value;

    // Generate HTML for preview
    let html = '';
    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        const lineNum = index + 1;

        // Vote buttons HTML
        const voteButtons = `
            <div class="vote-buttons">
                <button class="vote-btn upvote" title="Funciona">▲</button>
                <button class="vote-btn downvote" title="No funciona">▼</button>
            </div>
        `;

        if (isPhoneNumber(trimmedLine)) {
            // Extract the phone number (keeping original format for display)
            const phoneLink = formatPhoneForLink(trimmedLine);
            const country = getCountryFromPhone(phoneLink);
            const countryBadge = country
                ? `<span class="country-badge">${country.flag} ${country.name}</span>`
                : '';

            html += `
                <div class="phone-line" data-tel="${phoneLink}" style="animation-delay: ${index * 0.03}s">
                    <div class="phone-content">
                        <span class="line-number">${lineNum}</span>
                        <span class="phone-link">${trimmedLine}</span>
                    </div>
                    <div class="line-actions">
                        ${countryBadge}
                        ${voteButtons}
                    </div>
                </div>
            `;
        } else {
            // Check if line contains phone numbers mixed with text
            const phoneRegex = /(\+?\d[\d\s\-\(\)\.]{6,})/g;
            let processedLine = trimmedLine;

            if (phoneRegex.test(trimmedLine)) {
                const phoneMatch = trimmedLine.match(phoneRegex);
                const phoneLink = phoneMatch ? formatPhoneForLink(phoneMatch[0]) : '';

                processedLine = trimmedLine.replace(phoneRegex, (match) => {
                    const country = getCountryFromPhone(formatPhoneForLink(match));
                    const countryBadge = country
                        ? `<span class="country-badge-inline">${country.flag}</span>`
                        : '';
                    return `<span class="phone-link">${match}</span>${countryBadge}`;
                });
                html += `<div class="phone-line" data-tel="${phoneLink}" style="animation-delay: ${index * 0.03}s"><div class="phone-content"><span class="line-number">${lineNum}</span><span>${processedLine}</span></div><div class="line-actions">${voteButtons}</div></div>`;
            } else {
                html += `<div class="text-line" style="animation-delay: ${index * 0.03}s"><span class="line-number">${lineNum}</span>${trimmedLine}</div>`;
            }
        }
    });

    elements.previewContainer.innerHTML = html;
    elements.shareSection.style.display = 'block';

    // Add click handlers to track touched lines
    addPhoneLineClickHandlers();

    // Generate unique page ID for sharing
    generatedPageId = generatePageId();

    // Generate QR code
    generateQRCode();

    showToast('Generado');

    // Scroll to preview
    elements.previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Add click handlers to phone lines to track which was last touched
 */
function addPhoneLineClickHandlers() {
    const phoneLines = elements.previewContainer.querySelectorAll('.phone-line');

    phoneLines.forEach(line => {
        // Handle line click - call phone number and mark as touched
        line.addEventListener('click', function (e) {
            // Don't do anything if clicking on vote buttons
            if (e.target.classList.contains('vote-btn')) {
                return;
            }

            // Remove 'touched' class from all lines
            phoneLines.forEach(l => l.classList.remove('touched'));
            // Add 'touched' class to the clicked line
            this.classList.add('touched');

            // Get the phone number from data attribute and call it
            const tel = this.getAttribute('data-tel');
            if (tel) {
                window.location.href = 'tel:' + tel;
            }
        });

        // Handle upvote button
        const upvoteBtn = line.querySelector('.vote-btn.upvote');
        const downvoteBtn = line.querySelector('.vote-btn.downvote');

        if (upvoteBtn) {
            upvoteBtn.addEventListener('click', function (e) {
                e.stopPropagation(); // Prevent triggering line click

                // Toggle upvote
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                } else {
                    this.classList.add('active');
                    // Remove downvote if active
                    if (downvoteBtn) {
                        downvoteBtn.classList.remove('active');
                    }
                }
            });
        }

        if (downvoteBtn) {
            downvoteBtn.addEventListener('click', function (e) {
                e.stopPropagation(); // Prevent triggering line click

                // Toggle downvote
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                } else {
                    this.classList.add('active');
                    // Remove upvote if active
                    if (upvoteBtn) {
                        upvoteBtn.classList.remove('active');
                    }
                }
            });
        }
    });
}

/**
 * Generate a unique page ID
 */
function generatePageId() {
    return Math.random().toString(36).substring(2, 10);
}

/**
 * Get the shareable view URL with compressed content
 */
function getShareUrl() {
    const shareText = currentContent;
    let encodedContent;

    // Use LZString compression if available (much smaller URLs)
    if (typeof LZString !== 'undefined') {
        encodedContent = LZString.compressToEncodedURIComponent(shareText);
    } else {
        // Fallback to base64
        encodedContent = encodeURIComponent(btoa(unescape(encodeURIComponent(shareText))));
    }

    const baseUrl = window.location.href.split('/').slice(0, -1).join('/');
    return baseUrl + '/view.html#' + encodedContent;
}

/**
 * Generate QR code
 */
let qrCodeInstance = null;

function generateQRCode() {
    // Clear previous QR code
    elements.qrCode.innerHTML = '';

    const shareUrl = getShareUrl();

    // Check URL length and warn if too long
    if (shareUrl.length > 2000) {
        showToast('Lista muy larga para QR');
        console.warn('URL length:', shareUrl.length);
    }

    // Generate QR code using qrcodejs syntax
    if (typeof QRCode !== 'undefined') {
        try {
            qrCodeInstance = new QRCode(elements.qrCode, {
                text: shareUrl,
                width: 200,
                height: 200,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.L // Lower correction = simpler QR
            });
        } catch (error) {
            console.error('Error generating QR code:', error);
            showToast('Error QR - lista muy larga');
        }
    } else {
        console.warn('QRCode library not available');
    }
}

/**
 * Download QR code as image
 */
function downloadQR() {
    const canvas = elements.qrCode.querySelector('canvas');
    if (!canvas) {
        showToast('Genera primero');
        return;
    }

    const link = document.createElement('a');
    link.download = `callpaste-qr-${generatedPageId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    showToast('QR descargado');
}

/**
 * Share on WhatsApp
 */
function shareWhatsApp() {
    if (!currentContent) {
        showToast('Genera primero');
        return;
    }

    const shareUrl = getShareUrl();
    const message = encodeURIComponent('Lista de contactos: ' + shareUrl);
    window.open(`https://wa.me/?text=${message}`, '_blank');

    showToast('Abriendo WhatsApp');
}

/**
 * Share on Telegram
 */
function shareTelegram() {
    if (!currentContent) {
        showToast('Genera primero');
        return;
    }

    const shareUrl = getShareUrl();
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Lista de contactos')}`;
    window.open(url, '_blank');

    showToast('Abriendo Telegram');
}

/**
 * Copy shareable URL to clipboard
 */
async function copyContent() {
    if (!currentContent) {
        showToast('Genera primero');
        return;
    }

    const shareUrl = getShareUrl();

    try {
        await navigator.clipboard.writeText(shareUrl);
        showToast('URL copiada');
    } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('URL copiada');
    }
}

/**
 * Clear all content
 */
function clearContent() {
    elements.contentInput.value = '';
    elements.previewContainer.innerHTML = '<p class="placeholder-text">El contenido aparecerá aquí...</p>';
    elements.shareSection.style.display = 'none';
    elements.qrCode.innerHTML = '';
    currentContent = '';
    generatedPageId = null;
    updateLineCount();
    showToast('Limpiado');
}

/**
 * Load content from URL hash (for shared links)
 */
function loadFromHash() {
    const hash = window.location.hash.slice(1);
    if (hash) {
        try {
            const decoded = decodeURIComponent(escape(atob(decodeURIComponent(hash))));
            elements.contentInput.value = decoded;
            updateLineCount();
            // Auto-generate preview
            setTimeout(() => {
                generatePreview();
            }, 500);
        } catch (e) {
            console.log('Could not decode hash');
        }
    }
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Format buttons
    elements.btnAddPrefix.addEventListener('click', addPrefix);
    elements.btnRemovePrefix.addEventListener('click', removePrefix);
    elements.btnNumberLines.addEventListener('click', numberLines);

    // Main actions
    elements.btnGenerate.addEventListener('click', generatePreview);
    elements.btnClear.addEventListener('click', clearContent);

    // Share buttons
    elements.btnWhatsapp.addEventListener('click', shareWhatsApp);
    elements.btnTelegram.addEventListener('click', shareTelegram);
    elements.btnCopy.addEventListener('click', copyContent);
    elements.btnDownloadQr.addEventListener('click', downloadQR);

    // Update line count on input
    elements.contentInput.addEventListener('input', updateLineCount);

    // Theme toggle
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', toggleTheme);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to generate
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            generatePreview();
        }
    });
}

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

/**
 * Load saved theme
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    initEventListeners();
    loadFromHash();
});
