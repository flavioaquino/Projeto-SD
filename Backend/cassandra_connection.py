from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
import json

# Configuração do bundle de conexão segura
cloud_config = {
    'secure_connect_bundle': 'secure-connect-projeto-sd.zip'
}

# Carregar as credenciais do token de autenticação
with open("projeto_sd-token.json") as f:
    secrets = json.load(f)

CLIENT_ID = secrets["clientId"]
CLIENT_SECRET = secrets["secret"]

# Criar o provedor de autenticação e a conexão com o cluster
auth_provider = PlainTextAuthProvider(CLIENT_ID, CLIENT_SECRET)
cluster = Cluster(cloud=cloud_config, auth_provider=auth_provider)
session = cluster.connect()

# Executar uma consulta simples
row = session.execute("SELECT release_version FROM system.local").one()
if row:
    print(f"Cassandra Version: {row[0]}")
else:
    print("An error occurred.")

def get_session():
    cloud_config = {
        'secure_connect_bundle': 'secure-connect-projeto-sd.zip'
    }
    auth_provider = PlainTextAuthProvider(CLIENT_ID, CLIENT_SECRET)
    cluster = Cluster(cloud=cloud_config, auth_provider=auth_provider)
    session = cluster.connect('mykeyspace')
    return session
