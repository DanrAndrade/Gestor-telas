import httpx

MOCK_CIDS = [
    {"codigo": "J01.9", "descricao": "Sinusite aguda não especificada"},
    {"codigo": "J03.9", "descricao": "Amigdalite aguda não especificada"},
    {"codigo": "J06.9", "descricao": "Infecção aguda das vias aéreas superiores não especificada"},
    {"codigo": "E11.9", "descricao": "Diabetes mellitus não insulino-dependente sem complicações"},
    {"codigo": "I10", "descricao": "Hipertensão essencial (primária)"},
    {"codigo": "K21.9", "descricao": "Doença de refluxo gastroesofágico sem esofagite"},
    {"codigo": "M54.5", "descricao": "Dor lombar baixa"},
    {"codigo": "F41.1", "descricao": "Transtorno de ansiedade generalizada"}
]

async def buscar_cid(termo: str):
    # Mock search para o CID-11 / CID-10
    termo_lower = termo.lower()
    resultados = [
        cid for cid in MOCK_CIDS
        if termo_lower in cid["codigo"].lower() or termo_lower in cid["descricao"].lower()
    ]
    return resultados
