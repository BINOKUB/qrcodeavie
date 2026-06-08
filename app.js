/* Révision v1.3 - Gestion Dynamique des Cadres et Export HD - app.js */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialisation de la langue (depuis lang.js)
    if (typeof appliquerLangue === 'function') {
        appliquerLangue();
    }

    // Bouton de changement de langue
    const btnLang = document.getElementById('lang-toggle');
    if (btnLang) {
        btnLang.addEventListener('click', () => {
            const nouvelleLangue = langueCourante === 'fr' ? 'en' : 'fr';
            appliquerLangue(nouvelleLangue);
        });
    }

    // --- SECTION A : LE VIGILE (Passeport et Cryptage) ---
    const blocVente = document.getElementById('bloc-vente');
    const blocGenerateur = document.getElementById('bloc-generateur');
    const unlockBtn = document.getElementById('unlock-btn');
    const vipKeyInput = document.getElementById('vip-key');
    const errorMsg = document.getElementById('error-msg');
    
    // Vérification silencieuse au chargement
    if (localStorage.getItem('qr_vip_access') === 'valide') {
        blocVente.classList.remove('active');
        blocGenerateur.style.display = 'block';
        initialiserGenerateur(); // Démarre le moteur seulement si accès autorisé
    }

    // Tentative de déverrouillage manuel (Le test du Miroir Base64)
    unlockBtn.addEventListener('click', () => {
        const cleSaisie = vipKeyInput.value.trim();
        
        // 
        if (cleSaisie.length >= 50) {
            const prefixeCrypte = btoa(cleSaisie.substring(0, 7)); // 
            
            if (prefixeCrypte === 'UVItUFJPLQ==') {
                // VICTOIRE : Accès accordé
                localStorage.setItem('qr_vip_access', 'valide');
                blocVente.classList.remove('active');
                blocGenerateur.style.display = 'block';
                errorMsg.style.display = 'none';
                initialiserGenerateur();
                return;
            }
        }
        
        // ECHEC : Si on arrive ici, la clé est mauvaise
        errorMsg.style.display = 'block';
    });

    // --- SECTION B : LE MOTEUR DU GÉNÉRATEUR ---
    function initialiserGenerateur() {
        
        // Gestion des Onglets (Tabs)
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        let activeTab = 'tab-link'; // Par défaut

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                activeTab = btn.getAttribute('data-target');
                document.getElementById(activeTab).classList.add('active');
            });
        });

        // Initialisation de la librairie QRCodeStyling
        const qrCode = new QRCodeStyling({
            width: 250, // Légèrement réduit pour bien s'intégrer dans le cadre
            height: 250,
            type: "svg", // SVG interne pour la meilleure qualité d'affichage
            data: "https://qrcodeavie.com",
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

        // Affichage initial
        qrCode.append(document.getElementById("qrcode-canvas"));

        // --- NOUVEAU : GESTION DYNAMIQUE DU CADRE ---
       
        const frameStyleSelect = document.getElementById('frame-style');
        const qrFrameWrapper = document.getElementById('qr-frame-wrapper');
        const iconBottom = document.getElementById('frame-icon-bottom');
        const labelBottom = document.getElementById('frame-label-bottom');

        frameStyleSelect.addEventListener('change', (e) => {
            const styleChoisi = e.target.value;
            
            // On nettoie toutes les classes
            qrFrameWrapper.className = '';
            
            if (styleChoisi === 'scan-me') {
                qrFrameWrapper.classList.add('frame-style-scan-me');
                iconBottom.textContent = '📱';
                labelBottom.textContent = 'Scan me';
            } 
            else if (styleChoisi === 'get-app') {
                qrFrameWrapper.classList.add('frame-style-get-app');
                iconBottom.textContent = '🅰️'; // Icône d'application
                labelBottom.textContent = 'Get the app';
            }
            else if (styleChoisi === 'like-us') {
                qrFrameWrapper.classList.add('frame-style-like-us');
                // L'icône du haut est déjà en dur dans le HTML (👍 Like us)
            }
            // Si 'none', il reste sans classe (état brut)
        });



        // Gestionnaire du logo (Upload local)
        let logoBase64 = "";
        const logoInput = document.getElementById('logo-input');
        logoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    logoBase64 = event.target.result;
                    mettreAJourQR(); // Met à jour automatiquement
                };
                reader.readAsDataURL(file);
            }
        });

        // Fonction principale de mise à jour
        function mettreAJourQR() {
            let finalData = "";

            if (activeTab === 'tab-link') {
                finalData = document.getElementById('qr-url').value.trim();
                if (!finalData) finalData = "https://qrcodeavie.com";
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

        document.getElementById('update-qr-btn').addEventListener('click', mettreAJourQR);

        // --- SECTION C : EXPORTATION AVEC HTML2CANVAS ---
        
        // Fonction globale de téléchargement d'image (Cadre Inclus)
        // Fonction globale de téléchargement d'image (Cadre Inclus)
        function telechargerCadre(format) {
            const wrapper = document.getElementById('qr-frame-wrapper');
            
            // L'astuce : Fond blanc forcé pour le JPG, Transparence préservée pour le PNG
            const couleurDeFond = format === 'jpg' ? '#ffffff' : null;
            
            html2canvas(wrapper, {
                backgroundColor: couleurDeFond, 
                scale: 3 // Échelle x3 pour une très haute définition
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = `QR_Code_Premium.${format}`;
                const mimeType = format === 'jpg' ? 'jpeg' : 'png';
                link.href = canvas.toDataURL(`image/${mimeType}`);
                link.click();
            });
        }

        document.getElementById('dl-png').addEventListener('click', () => {
            telechargerCadre('png');
        });

        document.getElementById('dl-jpg').addEventListener('click', () => {
            telechargerCadre('jpg');
        });

        // Le SVG exporte uniquement le vecteur pur pour les imprimeurs professionnels
        document.getElementById('dl-svg').addEventListener('click', () => {
            qrCode.download({ name: "QR_Code_Pur", extension: "svg" });
        });
    }
});
