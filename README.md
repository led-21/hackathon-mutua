# 📈 Sistema de Agricultura de Precisão com Assistentes de IA
## 🛠️ Layout do Diagrama
## Tipo: Arquitetura em Camadas

Camadas (de baixo para cima):
- Camada Física: Sensores, Drones, Dispositivos IoT
- Camada de Ingestão de Dados: Azure IoT Hub
- Camada de Processamento: Backend (C#), Agentes de IA (Autogen), Modelos de Visão, RAG
- Camada de Armazenamento: Bancos de Dados, Repositórios de Documentos
- Camada de Aplicação: Interface Multilíngue, Relatórios, Alertas
- Camada de Usuários: Agricultores, Cooperativas (Mobile/Web)

## 📡 Componentes e Conexões
## Camada Física
- Sensores de Solo: Umidade, temperatura, nutrientes
- Drones: Imagens NDVI, monitoramento de saúde das plantas
- Estações Meteorológicas: Dados climáticos em tempo real

### Conexões:
- Sensores/Drones → Azure IoT Hub (MQTT/HTTP - streaming em tempo real)
- Drones ←→ Agente Autogen (atualização autônoma de rotas)

## Camada de Ingestão de Dados
- Azure IoT Hub: Coleta e roteamento dos dados de sensores e drones

### Conexões:
- Recebe dados da Camada Física
- Envia dados para o Backend (C#)
- Armazena dados brutos no Banco de Dados de Séries Temporais

## Camada de Processamento
- Backend (C#): Orquestra o fluxo de dados e disponibiliza APIs
- Agentes Autogen:
  - Agente 1: Análise de déficits de água/nutrientes
  - Agente 2: Detecção de pragas via processamento de imagens
  - Agente 3: Otimização de rotas de drones
- Agente de Visão: Classificação de imagens (saudável vs infestado)
- Módulo RAG: Recuperação de documentos da FAO/EMBRAPA
- Modelo Preditivo: Necessidade de irrigação baseada em dados climáticos
- API de Tradução: Tradução multilíngue de alertas/relatórios

### Conexões:
- Backend ←→ Azure IoT Hub
- Backend → Agentes Autogen
- Backend → Agente de Visão (imagens)
- Backend ←→ Módulo RAG (consultas)
- Backend ← Modelo Preditivo
- Backend ←→ API Tradução

## Camada de Armazenamento
- Banco de Dados de Séries Temporais
- Repositório de Documentos: Manuais técnicos (FAO/EMBRAPA)
- Banco de Dados Relacional: Perfis de usuários, feedbacks (ex.: SQL Server)

### Conexões:
- Azure IoT Hub → Banco de Dados de Séries Temporais
- Módulo RAG ←→ Repositório de Documentos
- Backend ←→ Banco de Dados Relacional

## Camada de Aplicação
- Interface Multilíngue: Aplicativo Mobile/Web (Português, Hindi, Espanhol, etc.)
- Relatórios Automatizados: PDFs/Planilhas traduzidos
- Alertas em Tempo Real: Notificações push

### Conexões:
- Interface ↔ Backend (APIs)
- Alertas/Relatórios ← API LILT
- Interface → Backend (feedback de usuários)

## Camada de Usuários
- Agricultores: Acesso via aplicativo móvel (pequena escala)
- Cooperativas: Acesso via painel web (grande escala)

### Conexões:
- Usuários ↔ Interface Multilíngue
- Usuários → Interface (feedback)

## 🔄 Elementos Adicionais
- Pipeline CI/CD
- GitHub Actions: Automatiza atualizações de modelos e backend

## Fluxo: Atualizações contínuas → Backend e Modelos de IA
- Loop de Feedback
- Fluxo:
  - Usuários → Interface → Banco de Dados Relacional → Retreinamento dos modelos (via Backend)

## 🔀 Exemplo de Fluxo de Dados
- Sensores detectam baixa umidade → Azure IoT Hub
- Dados enviados ao Backend → Agente Autogen 1 analisa déficit
- Modelo Preditivo sugere aumento de irrigação
- API LILT traduz o alerta ("Aumentar irrigação em 10%") para Hindi
- Alerta enviado ao agricultor via app mobile
- Drones detectam pragas → Agente de Visão classifica → Agente Autogen 2 prioriza ação
- Módulo RAG recupera tratamento orgânico da EMBRAPA
- Alerta técnico gerado em Português
- Agricultor envia feedback sobre o alerta → Atualizações aplicadas via CI/CD

## 📢 Observação
Este projeto é uma evolução do projeto inicial [hackathon-microsoft-agro.](https://github.com/led-21/hackathon-microsoft-agro) 

3rd place Microsoft Hackathon Innovation Challenge December 2024.
