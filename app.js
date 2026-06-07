/* Révision v1.0 - Le Cerveau Crypté et Générateur - app.js */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialisation de la langue (depuis lang.js)
    if (typeof appliquerLangue === 'function') {
        appliquerLangue();
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
        
        // La règle d'or : On prend les 7 premiers caractères, on les crypte, et on compare
        // + On exige au moins 50 caractères de longueur totale.
        if (cleSaisie.length >= 50) {
            const prefixeCrypte = btoa(cleSaisie.substring(0, 7)); // btoa = Base64 Encode
            
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
            width: 300,
            height: 300,
            type: "svg", // SVG interne pour la meilleure qualité d'affichage
            data: "https://qrcodeavie.com",
            image: "",
            dotsOptions: {
                color: "#000000",
                type: "square" // square ou dots
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

        // Gestionnaire du logo (Upload local)
        let logoBase64 = "";
        const logoInput = document.getElementById('logo-input');
        logoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    logoBase64 = event.target.result;
                    mettreAJourQR(); // Met à jour automatiquement quand on charge un logo
                };
                reader.readAsDataURL(file);
            }
        });

        // Fonction principale de mise à jour
        function mettreAJourQR() {
            let finalData = "";

            // 1. Déterminer le contenu selon l'onglet actif
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
                
                // Formatage strict de la vCard
                finalData = `BEGIN:VCARD\nVERSION:3.0\nN:${nom};${prenom};;;\nFN:${prenom} ${nom}\nORG:${entreprise}\nTEL:${tel}\nEMAIL:${email}\nEND:VCARD`;
            }

            // 2. Récupérer les styles
            const colorDark = document.getElementById('color-dark').value;
            const colorLight = document.getElementById('color-light').value;
            const dotStyle = document.getElementById('dot-style').value;

            // 3. Appliquer à la librairie
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

        // Action du bouton "Mettre à jour"
        document.getElementById('update-qr-btn').addEventListener('click', mettreAJourQR);

        // --- SECTION C : EXPORTATION ---
        document.getElementById('dl-png').addEventListener('click', () => {
            qrCode.download({ name: "QR_Code", extension: "png" });
        });

        document.getElementById('dl-jpg').addEventListener('click', () => {
            qrCode.download({ name: "QR_Code", extension: "jpeg" });
        });

        document.getElementById('dl-svg').addEventListener('click', () => {
            qrCode.download({ name: "QR_Code", extension: "svg" });
        });
    }
});
