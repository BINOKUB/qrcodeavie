/* Révision v1.0 - Dictionnaire Multilingue - lang.js */

const dictionnaire = {
    fr: {
        appTitle: "QR Code à Vie",
        appSubtitle: "Générateur Statique Premium. Aucun abonnement. 100% Privé.",
        linkPourquoi: "Pourquoi nous choisir ?",
        linkcodebarre: "Code Barre Industriel",
        
        // Bloc A : Vente & Déverrouillage
        lockTitle: "Accès Sécurisé",
        lockDesc: "Entrez votre clé d'accès à vie pour utiliser le générateur.",
        btnUnlock: "Déverrouiller le Générateur",
        btnBuy: "Acheter mon accès à vie (50$)",
        errorMsg: "Clé invalide ou accès refusé.",
        
        // Bloc B : Le Générateur (Onglets)
        tabLink: "Lien / Texte",
        tabWifi: "Réseau Wi-Fi",
        tabVcard: "Contact (vCard)",
        
        // Champs de saisie
        placeholderUrl: "ex: https://mon-site.com",
        labelSsid: "Nom du réseau (SSID)",
        labelWifiPass: "Mot de passe",
        labelWifiType: "Type de sécurité",
        labelName: "Prénom",
        labelLastname: "Nom",
        labelPhone: "Téléphone",
        labelEmail: "Courriel",
        labelCompany: "Entreprise",
        
        // Personnalisation
        titleCustom: "🎨 Personnalisation",
        labelColorDark: "Couleur des motifs :",
        labelColorLight: "Couleur de fond :",
        labelStyle: "Style des points :",
        optSquare: "Carrés",
        optDots: "Arrondis",
        btnLogo: "Ajouter un Logo",
        
        // Exportation
        titleExport: "💾 Exportation Haute Qualité",
        btnGenerate: "Mettre à jour le QR Code",
        btnPng: "PNG (Web)",
        btnJpg: "JPG (Standard)",
        btnSvg: "SVG (Impression Pro)"
    },
    en: {
        appTitle: "Lifetime QR Code",
        appSubtitle: "Premium Static Generator. No subscriptions. 100% Private.",
        linkPourquoi: "Why choose us?",
         linkcodebarre: "Industriel Barecode",
        
        // Bloc A : Vente & Déverrouillage
        lockTitle: "Secure Access",
        lockDesc: "Enter your lifetime access key to use the generator.",
        btnUnlock: "Unlock Generator",
        btnBuy: "Get lifetime access ($50)",
        errorMsg: "Invalid key or access denied.",
        
        // Bloc B : Le Générateur (Onglets)
        tabLink: "Link / Text",
        tabWifi: "Wi-Fi Network",
        tabVcard: "Contact (vCard)",
        
        // Champs de saisie
        placeholderUrl: "e.g., https://my-website.com",
        labelSsid: "Network Name (SSID)",
        labelWifiPass: "Password",
        labelWifiType: "Security Type",
        labelName: "First Name",
        labelLastname: "Last Name",
        labelPhone: "Phone",
        labelEmail: "Email",
        labelCompany: "Company",
        
        // Personnalisation
        titleCustom: "🎨 Customization",
        labelColorDark: "Pattern Color:",
        labelColorLight: "Background Color:",
        labelStyle: "Dot Style:",
        optSquare: "Square",
        optDots: "Rounded",
        btnLogo: "Upload Logo",
        
        // Exportation
        titleExport: "💾 High-Quality Export",
        btnGenerate: "Update QR Code",
        btnPng: "PNG (Web)",
        btnJpg: "JPG (Standard)",
        btnSvg: "SVG (Pro Print)"
    }
};

// Fonction pour appliquer la langue au chargement (par défaut basé sur le navigateur)
// Fonction globale de changement de langue
// Fonction globale de changement de langue
let langueCourante = localStorage.getItem('qr_langue') || (navigator.language.startsWith('fr') ? 'fr' : 'en');

function appliquerLangue(langForcee) {
    if (langForcee) {
        langueCourante = langForcee;
        localStorage.setItem('qr_langue', langueCourante);
    }
    
    const textes = dictionnaire[langueCourante];

    document.querySelectorAll('[data-lang]').forEach(element => {
        const cle = element.getAttribute('data-lang');
        if (textes[cle]) {
            if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                element.placeholder = textes[cle];
            } else {
                element.textContent = textes[cle];
            }
        }
    });

    // LA MAGIE ICI : Mise à jour dynamique du texte du bouton
    const btnLang = document.getElementById('lang-toggle');
    if (btnLang) {
        // Si on est en FR, le bouton propose "EN". Si on est en EN, il propose "FR".
        btnLang.textContent = langueCourante === 'fr' ? 'EN' : 'FR';
    }
}
