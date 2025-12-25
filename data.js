const STORE = {
    personalization: {
        title: "Personalização",
        text: "Cada peça pode ser personalizada de acordo com as cores disponíveis. Se quiser uma combinação específica, me chama e eu te digo o que dá pra fazer.",
        colors: [
            { name: "Caramelo", hex: "#B68A3A" },
            { name: "Verde bandeira", hex: "#2FA56A" },
            { name: "Vermelho", hex: "#C7353A" },
            { name: "Azul royal", hex: "#3F5FAF" },
            { name: "Off-white", hex: "#F2EFEA" },
            { name: "Verde limão claro", hex: "#A6C94A" },
            { name: "Azul marinho", hex: "#1F2A44" },
            { name: "Preto", hex: "#1E1E1E" },
            { name: "Rosa pink", hex: "#D84A8C" },
            { name: "Lilás", hex: "#C8B6E2" }
        ]

    },
    promos: [
        { title: "10% OFF em chaveiros selecionados", text: "Válido para modelos marcados com badge de desconto." },
        { title: "Combo: 3 vasinhos + 50% OFF em 1 chaveiro", text: "Escolha as cores e combine como preferir." },
    ],

    products: [
        // --- CHAVEIROS ---
        {
            id: "key-polvinho-medio",
            category: "chaveiros",
            name: "Chaveiro Polvinho Médio",
            price: 17.90,
            description: "Ideal para bolsas ou mochilas. Peso 30g, tamanho 5x5x8",
            badge: "",
            featured: true,
            photos: [
                "img/polvinho_medio1.jpg",
                "img/polvinho_medio3.jpg",
                "img/polvinho_medio4.jpg",
                "img/polvinho_medio5.jpg",
                "img/polvinho_medio6.jpg",
                "img/polvinho_medio7.jpg",
                "img/polvinho_medio8.jpg",
            ]
        },
        {
            id: "key-polvinho_pequeno-1",
            category: "chaveiros",
            name: "Chaveiro Polvinho Pequeno 1",
            price: 12.90,
            description: "Um clássico para o molho de chaves. Peso 17g, tamanho 4x4x5",
            badge: "",
            featured: true,
            photos: [
                "img/polvinho_pequeno1.jpg",
                "img/polvinho_pequeno2.jpg",
                "img/polvinho_pequeno3.jpg",
                "img/polvinho_pequeno7.jpg",
                "img/polvinho_pequeno8.jpg",
            ]
        },
        {
            id: "key-polvinho_pequeno-2",
            category: "chaveiros",
            name: "Chaveiro Polvinho Pequeno 2",
            price: 12.90,
            description: "Um clássico para o molho de chaves. Peso 16g, tamanho 4x4x4",
            badge: "",
            featured: false,
            photos: [
                "img/polvinho_pequeno4.jpg",
                "img/polvinho_pequeno5.jpg",
                "img/polvinho_pequeno6.jpg"
            ]
        },
        {
            id: "key-polvinho-grande",
            category: "chaveiros",
            name: "Chaveiro Polvinho Grande",
            price: 27.90,
            description: "Peso 50g, tamanho 12x12x20",
            badge: "",
            featured: false,
            photos: [
                "img/polvinho_grande1.jpg"
            ]
        },
        {
            id: "key-tulipa",
            category: "chaveiros",
            name: "Chaveiro Tulipa",
            price: 12.90,
            description: "Chaveiro em forma de tulipa, regulável. Peso 35g, tamanho 5x5x6 cada.",
            badge: "",
            featured: false,
            photos: [
                "img/tulipa1.jpg",
                "img/tulipa2.jpg"
            ]
        },
        {
            id: "key-lily",
            category: "chaveiros",
            name: "Chaveiro Lírio",
            price: 12.90,
            description: "Chaveiro em forma de lírio, regulável. Peso 20g, tamanho 4x4x3 cada.",
            badge: "",
            featured: false,
            photos: [
                "img/lily1.jpg",
                "img/lily2.jpg"
            ]
        },
        {
            id: "key-cacto",
            category: "chaveiros",
            name: "Chaveiro Cacto",
            price: 12.90,
            description: "Chaveiro em forma de cacto, regulável. Peso 30g, tamanho 5x5x7.",
            badge: "",
            featured: false,
            photos: [
                "img/cacto1.jpg",
                "img/cacto2.jpg",
            ]
        },

        // --- PLANTAS & VASINHOS ---
        {
            id: "kit_love",
            category: "plantas",
            name: "Cactos Kit Love",
            price: 119.90,
            description: "Kit com 4 vasinhos de cactos em crochê. Peso total 300g, tamanho aproximado 10x10x12cm cada.",
            badge: "COMBO",
            featured: true,
            photos: [
                "img/kit_love1.jpg",
                "img/kit_love2.jpg"
            ]
        },
        {
            id: "vaso_rosa",
            category: "plantas",
            name: "Vaso Rosa da Paixão",
            price: 79.90,
            description: "Vaso em crochê com duas rosas e um botão (gato não incluso). Peso 130, tamanho aproximado 9x9x25cm.",
            badge: "",
            featured: false,
            photos: [
                "img/rosas1.jpg",
                "img/rosas2.jpg",
                "img/rosas4.jpg"
            ]
        },
        {
            id: "vaso_tulipas",
            category: "plantas",
            name: "Vaso Tulipas",
            price: 79.90,
            description: "Vaso em crochê com duas tulipas e um botão (gato não incluso). Peso 120, tamanho aproximado 9x9x22cm.",
            badge: "",
            featured: false,
            photos: [
                "img/tulipas1.jpg",
                "img/tulipas2.jpg",
                "img/tulipas3.jpg",
                "img/tulipas4.jpg",
            ]
        },
        {
            id: "vasinho_rosas",
            category: "plantas",
            name: "Vasinho Rosas",
            price: 29.90,
            description: "Vasinho em crochê com três rosas pequenas. Peso 50g, tamanho aproximado 7x7x8cm.",
            badge: "",
            featured: true,
            photos: [
                "img/vasinho_rosa1.jpg",
                "img/vasinho_rosa2.jpg",
            ]
        },
        {
            id: "vasinho_suculentas",
            category: "plantas",
            name: "Vasinho Suculentas",
            price: 29.90,
            description: "Vasinho de suculentas pequenas. Peso 50g, tamanho aproximado 7x7x8cm.",
            badge: "",
            featured: true,
            photos: [
                "img/vasinho_suculenta1.jpg",
                "img/vasinho_suculenta2.jpg",
                "img/vasinho_suculenta3.jpg",
            ]
        },
        {
            id: "vasinho_cacto",
            category: "plantas",
            name: "Vasinho Cacto",
            price: 29.90,
            description: "Vasinho de cacto pequeno. Peso 50g, tamanho aproximado 7x7x8cm.",
            badge: "",
            featured: true,
            photos: [
                "img/vasinho_cacto1.jpg",
                "img/vasinho_cacto2.jpg",
            ]
        },
        {
            id: "vasinho_sortido",
            category: "plantas",
            name: "Vasinho Sortido",
            price: 29.90,
            description: "Vasinho de flores sortidas. Peso 50g, tamanho aproximado 7x7x8cm.",
            badge: "",
            featured: true,
            photos: [
                "img/vasinho_sortido1.jpg",
                "img/vasinho_sortido2.jpg",
                "img/vasinho_sortido3.jpg",
            ]
        }
    ]
};
