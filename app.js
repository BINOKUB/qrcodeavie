/* Révision v1.5 - Nettoyage complet des textes et support Facebook / JEVEND - app.js */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialisation de la langue
    if (typeof appliquerLangue === 'function') {
        appliquerLangue();
    }

    const btnLang = document.getElementById('lang-toggle');
    if (btnLang) {
        btnLang.addEventListener('click', () => {
            const nouvelleLangue = langueCourante === 'fr' ? 'en' : 'fr';
            appliquerLangue(nouvelleLangue);
        });
    }

    // --- SECTION A : GESTION DES ACCÈS ---
    const blocVente = document.getElementById('bloc-vente');
    const blocGenerateur = document.getElementById('bloc-generateur');
    const unlockBtn = document.getElementById('unlock-btn');
    const vipKeyInput = document.getElementById('vip-key');
    const errorMsg = document.getElementById('error-msg');
    
    if (localStorage.getItem('qr_vip_access') === 'valide') {
        if (blocVente) blocVente.classList.remove('active');
        if (blocGenerateur) blocGenerateur.style.display = 'block';
        initialiserGenerateur();
    }

    if (unlockBtn) {
        unlockBtn.addEventListener('click', () => {
            const cleSaisie = vipKeyInput.value.trim();
            if (cleSaisie.length >= 50) {
                const prefixeCrypte = btoa(cleSaisie.substring(0, 7));
                if (prefixeCrypte === 'UVItUFJPLQ==') {
                    localStorage.setItem('qr_vip_access', 'valide');
                    if (blocVente) blocVente.classList.remove('active');
                    if (blocGenerateur) blocGenerateur.style.display = 'block';
                    if (errorMsg) errorMsg.style.display = 'none';
                    initialiserGenerateur();
                    return;
                }
            }
            if (errorMsg) errorMsg.style.display = 'block';
        });
    }

    // --- SECTION B : MOTEUR DU GÉNÉRATEUR ---
    function initialiserGenerateur() {
        
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        let activeTab = 'tab-link';

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                activeTab = btn.getAttribute('data-target');
                document.getElementById(activeTab).classList.add('active');
            });
        });

        // Initialisation de la librairie QRCodeStyling avec URL JEVEND par défaut
        const qrCode = new QRCodeStyling({
            width: 250,
            height: 250,
            type: "svg",
            data: "https://jevend.com",
            image: "",
            dotsOptions: {
                color: "#000000",
                type: "square" 
            },
            backgroundOptions: {
                color: "#ffffff",
            },
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 10
            }
        });

        const canvasContainer = document.getElementById("qrcode-canvas");
        if (canvasContainer) {
            canvasContainer.innerHTML = '';
            qrCode.append(canvasContainer);
        }

        // --- GESTION DYNAMIQUE DU CADRE ET TEXTES EN FRANÇAIS ---
        const frameStyleSelect = document.getElementById('frame-style');
        const qrFrameWrapper = document.getElementById('qr-frame-wrapper');
        const iconTop = document.getElementById('frame-icon-top');
        const labelTop = document.getElementById('frame-label-top');
        const iconBottom = document.getElementById('frame-icon-bottom');
        const labelBottom = document.getElementById('frame-label-bottom');

        function appliquerStyleCadre(styleChoisi) {
            const t = (typeof dictionnaire !== 'undefined' && dictionnaire[langueCourante]) ? dictionnaire[langueCourante] : {};
            
            if (!qrFrameWrapper) return;
            qrFrameWrapper.className = '';
            
            // Reinitialisation des zones
            if (iconTop) iconTop.textContent = '';
            if (labelTop) labelTop.textContent = '';
            if (iconBottom) iconBottom.textContent = '';
            if (labelBottom) labelBottom.textContent = '';

            if (styleChoisi === 'scan-me') {
                qrFrameWrapper.classList.add('frame-style-scan-me');
                if (iconBottom) iconBottom.textContent = '📱';
                if (labelBottom) labelBottom.textContent = t.frameScanMe || 'Scannez-moi';
            } 
            else if (styleChoisi === 'facebook') {
                qrFrameWrapper.classList.add('frame-style-facebook');
                if (iconBottom) iconBottom.textContent = '📘';
                if (labelBottom) labelBottom.textContent = t.frameFacebook || 'Suivez-nous sur Facebook';
            }
            else if (styleChoisi === 'website') {
                qrFrameWrapper.classList.add('frame-style-website');
                if (iconBottom) iconBottom.textContent = '🌐';
                if (labelBottom) labelBottom.textContent = t.frameWebsite || 'Visiter le site web';
            }
            else if (styleChoisi === 'get-app') {
                qrFrameWrapper.classList.add('frame-style-get-app');
                if (iconBottom) iconBottom.textContent = '📱';
                if (labelBottom) labelBottom.textContent = t.frameGetApp || 'Télécharger l\'application';
            }
        }

        if (frameStyleSelect) {
            frameStyleSelect.addEventListener('change', (e) => {
                appliquerStyleCadre(e.target.value);
            });
            // Application du style par défaut lors du chargement
            appliquerStyleCadre(frameStyleSelect.value);
        }

        // Gestion du logo (Upload local)
        let logoBase64 = "";
        const logoInput = document.getElementById('logo-input');
        if (logoInput) {
            logoInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        logoBase64 = event.target.result;
                        mettreAJourQR();
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Fonction principale de mise à jour
        function mettreAJourQR() {
            let finalData = "";

            if (activeTab === 'tab-link') {
                finalData = document.getElementById('qr-url').value.trim();
                if (!finalData) finalData = "https://jevend.com";
            } 
            else if (activeTab === 'tab-wifi') {
                const ssid = document.getElementById('wifi-ssid').value.trim();
                const pass = document.getElementById('wifi-pass').value.trim();
                const type = document.getElementById('wifi-type').value;
                finalData = `WIFI:T:${type};S:${ssid};P:${pass};;`;
            } 
            else if (activeTab === 'tab-vcard') {
                const prenom = document.getElementById('vc-prenom').value.trim();
                const nom = document.getElementById('vc-nom').value.trim();
                const tel = document.getElementById('vc-tel').value.trim();
                const email = document.getElementById('vc-email').value.trim();
                const entreprise = document.getElementById('vc-entreprise').value.trim();
                
                finalData = `BEGIN:VCARD\nVERSION:3.0\nN:${nom};${prenom};;;\nFN:${prenom} ${nom}\nORG:${entreprise}\nTEL:${tel}\nEMAIL:${email}\nEND:VCARD`;
            }

            const colorDark = document.getElementById('color-dark').value;
            const colorLight = document.getElementById('color-light').value;
            const dotStyle = document.getElementById('dot-style').value;

            qrCode.update({
                data: finalData,
                image: logoBase64,
                dotsOptions: {
                    color: colorDark,
                    type: dotStyle
                },
                backgroundOptions: {
                    color: colorLight
                }
            });
        }

        const updateBtn = document.getElementById('update-qr-btn');
        if (updateBtn) updateBtn.addEventListener('click', mettreAJourQR);

        // --- EXPORTATION HAUTE DÉFINITION ---
        function telechargerCadre(format) {
            const wrapper = document.getElementById('qr-frame-wrapper');
            const couleurDeFond = format === 'jpg' ? '#ffffff' : null;
            
            html2canvas(wrapper, {
                backgroundColor: couleurDeFond, 
                scale: 3
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = `QR_Code_JEVEND.${format}`;
                const mimeType = format === 'jpg' ? 'jpeg' : 'png';
                link.href = canvas.toDataURL(`image/${mimeType}`);
                link.click();
            });
        }

        const dlPng = document.getElementById('dl-png');
        const dlJpg = document.getElementById('dl-jpg');
        const dlSvg = document.getElementById('dl-svg');

        if (dlPng) dlPng.addEventListener('click', () => telechargerCadre('png'));
        if (dlJpg) dlJpg.addEventListener('click', () => telechargerCadre('jpg'));
        if (dlSvg) dlSvg.addEventListener('click', () => {
            qrCode.download({ name: "QR_Code_JEVEND", extension: "svg" });
        });
    }
});
