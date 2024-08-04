import os
from flask import Flask, request, jsonify
from cassandra_connection import get_session
from uuid import uuid4

app = Flask(__name__)
session = get_session()

# Usa a variável de ambiente PORT, ou 5000 como padrão
PORT = int(os.environ.get('PORT', 5000))

# Endpoint para criar um novo produto
@app.route('/produtos', methods=['POST'])
def create_produto():
    print("Chamada recebida para criar produto.")
    data = request.json
    id = uuid4()  # Gera um UUID único
    nome = data.get('nome')
    preco = data.get('preco')
    quantidade = data.get('quantidade')
    
    query = "INSERT INTO produtos (id, nome, preco, quantidade) VALUES (%s, %s, %s, %s)"
    session.execute(query, (id, nome, preco, quantidade))
    return jsonify({'message': 'Produto criado', 'id': str(id)}), 201

# Endpoint para obter todos os produtos
@app.route('/produtos', methods=['GET'])
def get_produtos():
    print("Chamada recebida para obter produtos.")
    query = "SELECT * FROM produtos"
    rows = session.execute(query)
    produtos = [{'id': str(row.id), 'nome': row.nome, 'preco': row.preco, 'quantidade': row.quantidade} for row in rows]
    return jsonify(produtos), 200

# Endpoint para atualizar um produto existente
@app.route('/produtos/<uuid:id>', methods=['PUT'])
def update_produto(id):
    print("Chamada recebida para atualizar produto.")
    data = request.json
    nome = data.get('nome')
    preco = data.get('preco')
    quantidade = data.get('quantidade')
    
    query = "UPDATE produtos SET nome=%s, preco=%s, quantidade=%s WHERE id=%s"
    session.execute(query, (nome, preco, quantidade, id))
    return jsonify({'message': 'Produto atualizado'}), 200

# Endpoint para excluir um produto
@app.route('/produtos/<uuid:id>', methods=['DELETE'])
def delete_produto(id):
    print("Chamada recebida para deletar produto.")
    query = "DELETE FROM produtos WHERE id=%s"
    session.execute(query, (id,))
    return jsonify({'message': 'Produto deletado'}), 200

if __name__ == '__main__':
    # Vincula o servidor à porta definida pela variável de ambiente PORT
    app.run(host='0.0.0.0', port=PORT, debug=True)
