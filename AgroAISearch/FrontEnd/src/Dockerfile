# Use uma imagem base do Python
FROM python:3.11.9

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie o arquivo de requisitos para o diretório de trabalho
COPY requirements.txt .

# Instale as dependências do Python
RUN pip install --no-cache-dir -r requirements.txt

# Copie o código do aplicativo para o diretório de trabalho
COPY . .

# Exponha a porta que o Streamlit usará
EXPOSE 8501

# Comando para rodar o aplicativo Streamlit
CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]