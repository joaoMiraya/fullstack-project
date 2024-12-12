# Projeto - Técnico

### Visão geral

Esse foi feito para fins de estudo e prática. Consiste em simular viajens de taxi/carona fazendo uso da API do Google Routes.

### Especificações técnicas

O projeto foi feito todo em Typescript, usando o React para o front-end e o micro-framework fastify para a API. Também utilizei o Redis para armazenamento de cache, Redis Insight para gerenciar e analisar os dados e o MySQL como banco de dados. Toda a aplicação está rodando em containers do docker com o nginx.

### Conceitos praticados

* POO
    - Abstração
    - Encapsulamento
    - Herança
    - Polimorfismo

* Estratégias de cache
* Autenticação e Autorização
* Relacionamento e consultas avançadas em SQL
* Normalização de banco de dados
* Container e imagens Docker
* Gerenciamento de estados
* Manipulação dinâmica de formulários



## Para rodar a aplicação

1- Adicionar sua chave da api do google no docker-compose.

Na primeira vez rodar:

``docker compose up --build
``

Nas proximas:

``docker compose up -d
``

---
### Acessar a aplicação em http://localhost:80/