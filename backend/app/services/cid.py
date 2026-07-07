"""
Busca de CID-10 — retorna diagnósticos por código ou descrição.

Atualmente usa um banco de dados local com os CIDs mais comuns em clínicas gerais e odontológicas.
Para expandir: importar a tabela completa do CID-10 disponível no DataSUS (DATASUS/CID-10).

API oficial CID-11 (WHO): https://icd.who.int/icdapi
"""

CIDS = [
    # Odontologia
    {"codigo": "K01.0", "descricao": "Dentes inclusos"},
    {"codigo": "K02.0", "descricao": "Cárie limitada ao esmalte"},
    {"codigo": "K02.1", "descricao": "Cárie de dentina"},
    {"codigo": "K02.3", "descricao": "Cárie dentária detida"},
    {"codigo": "K04.0", "descricao": "Pulpite"},
    {"codigo": "K04.1", "descricao": "Necrose da polpa"},
    {"codigo": "K04.6", "descricao": "Abscesso periapical com fístula"},
    {"codigo": "K04.7", "descricao": "Abscesso periapical sem fístula"},
    {"codigo": "K05.0", "descricao": "Gengivite aguda"},
    {"codigo": "K05.1", "descricao": "Gengivite crônica"},
    {"codigo": "K05.2", "descricao": "Periodontite aguda"},
    {"codigo": "K05.3", "descricao": "Periodontite crônica"},
    {"codigo": "K07.0", "descricao": "Macrognatia"},
    {"codigo": "K08.1", "descricao": "Perda de dentes devida a acidente"},
    {"codigo": "K12.0", "descricao": "Aftas recorrentes"},
    {"codigo": "K12.1", "descricao": "Outras formas de estomatite"},
    # Clínica geral
    {"codigo": "A09", "descricao": "Diarreia e gastroenterite de origem infecciosa presumível"},
    {"codigo": "B01.9", "descricao": "Varicela sem complicações"},
    {"codigo": "B34.9", "descricao": "Infecção viral não especificada"},
    {"codigo": "E11.9", "descricao": "Diabetes mellitus não insulino-dependente sem complicações"},
    {"codigo": "E14.9", "descricao": "Diabetes mellitus não especificado, sem complicações"},
    {"codigo": "F32.9", "descricao": "Episódio depressivo não especificado"},
    {"codigo": "F41.0", "descricao": "Transtorno de pânico"},
    {"codigo": "F41.1", "descricao": "Transtorno de ansiedade generalizada"},
    {"codigo": "G43.9", "descricao": "Enxaqueca não especificada"},
    {"codigo": "I10", "descricao": "Hipertensão essencial (primária)"},
    {"codigo": "J00", "descricao": "Nasofaringite aguda (resfriado comum)"},
    {"codigo": "J01.9", "descricao": "Sinusite aguda não especificada"},
    {"codigo": "J02.9", "descricao": "Faringite aguda não especificada"},
    {"codigo": "J03.9", "descricao": "Amigdalite aguda não especificada"},
    {"codigo": "J06.9", "descricao": "Infecção aguda das vias aéreas superiores não especificada"},
    {"codigo": "J18.9", "descricao": "Pneumonia não especificada"},
    {"codigo": "J45.9", "descricao": "Asma não especificada"},
    {"codigo": "K21.9", "descricao": "Doença de refluxo gastroesofágico sem esofagite"},
    {"codigo": "K29.7", "descricao": "Gastrite não especificada"},
    {"codigo": "L50.9", "descricao": "Urticária não especificada"},
    {"codigo": "M10.9", "descricao": "Gota não especificada"},
    {"codigo": "M54.2", "descricao": "Cervicalgia"},
    {"codigo": "M54.5", "descricao": "Dor lombar baixa"},
    {"codigo": "N39.0", "descricao": "Infecção do trato urinário de localização não especificada"},
    {"codigo": "R05", "descricao": "Tosse"},
    {"codigo": "R51", "descricao": "Cefaleia"},
    {"codigo": "Z00.0", "descricao": "Exame médico geral"},
    {"codigo": "Z13.0", "descricao": "Exame especial para doenças do sangue e órgãos hematopoéticos"},
]


async def buscar_cid(termo: str):
    if not termo or len(termo) < 2:
        return []
    termo_lower = termo.strip().lower()
    resultados = [
        cid for cid in CIDS
        if termo_lower in cid["codigo"].lower() or termo_lower in cid["descricao"].lower()
    ]
    return resultados[:15]
