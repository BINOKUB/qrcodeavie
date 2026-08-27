/* Révision v1.1 - Dictionnaire Multilingue & Adapté JEVEND - lang.js */

const dictionnaire = {
    fr: {
        appTitle: "Générateur QR Code - JEVEND",
        appSubtitle: "Générateur Statique Premium pour vos vitrines et annonces locales.",
        
        // Bloc A : Vente & Déverrouillage
        lockTitle: "Accès Sécurisé",
        lockDesc: "Entrez votre clé d'accès à vie pour utiliser le générateur.",
        btnUnlock: "Déverrouiller le Générateur",
        btnBuy: "Acheter mon accès à vie (50$)",
        errorMsg: "Clé invalide ou accès refusé.",
        
        // Bloc B : Le Générateur (Onglets)
        tabLink: "Lien / Site Web",
        tabWifi: "Réseau Wi-Fi",
        tabVcard: "Contact (vCard)",
        
        // Champs de saisie
        placeholderUrl: "ex: https://jevend.com",
        labelSsid: "Nom du réseau (SSID)",
        labelWifiPass: "Mot de passe",
        labelWifiType: "Type de sécurité",
        labelName: "Prénom",
        labelLastname: "Nom",
        labelPhone: "Téléphone",
        labelEmail: "Courriel",
        labelCompany: "Entreprise",
        
        // Cadres & Intégration JEVEND
        frameScanMe: "Scannez-moi",
        frameGetApp: "Télécharger l'app",
        frameFacebook: "Suivez-nous sur Facebook",
        frameWebsite: "Visiter le site web",

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
        appTitle: "QR Code Generator - JEVEND",
        appSubtitle: "Premium Static Generator for local showcases and ads.",
        
        // Bloc A : Lock
        lockTitle: "Secure Access",
        lockDesc: "Enter your lifetime access key to use the generator.",
        btnUnlock: "Unlock Generator",
        btnBuy: "Get lifetime access ($50)",
        errorMsg: "Invalid key or access denied.",
        
        // Bloc B : Tabs
        tabLink: "Link / Website",
        tabWifi: "Wi-Fi Network",
        tabVcard: "Contact (vCard)",
        
        // Fields
        placeholderUrl: "e.g., https://jevend.com",
        labelSsid: "Network Name (SSID)",
        labelWifiPass: "Password",
        labelWifiType: "Security Type",
        labelName: "First Name",
        labelLastname: "Last Name",
        labelPhone: "Phone",
        labelEmail: "Email",
        labelCompany: "Company",
        
        // Frames
        frameScanMe: "Scan me",
        frameGetApp: "Get the app",
        frameFacebook: "Follow us on Facebook",
        frameWebsite: "Visit our website",
        
        // Customization
        titleCustom: "🎨 Customization",
        labelColorDark: "Pattern Color:",
        labelColorLight: "Background Color:",
        labelStyle: "Dot Style:",
        optSquare: "Square",
        optDots: "Rounded",
        btnLogo: "Upload Logo",
        
        // Export
        titleExport: "💾 High-Quality Export",
        btnGenerate: "Update QR Code",
        btnPng: "PNG (Web)",
        btnJpg: "JPG (Standard)",
        btnSvg: "SVG (Pro Print)"
    }
};

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

    const btnLang = document.getElementById('lang-toggle');
    if (btnLang) {
        btnLang.textContent = langueCourante === 'fr' ? 'EN' : 'FR';
    }
}
