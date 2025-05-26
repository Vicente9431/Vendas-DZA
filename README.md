# Gestion App - Repositório para Implantação Permanente

Este repositório contém o backend do Sistema de Gestão Empresarial, preparado para implantação permanente em serviços de hospedagem Node.js.

## Estrutura do Projeto

```
gestion-app-repo/
├── src/
│   ├── controllers/    # Controladores para cada módulo
│   ├── routes/         # Rotas da API
│   └── config/         # Configurações (Firebase, etc.)
├── server-prod.js      # Ponto de entrada para produção
├── package.json        # Dependências e scripts
├── Procfile            # Configuração para Heroku
└── .env.production     # Variáveis de ambiente para produção
```

## Requisitos

- Node.js 18.x ou superior
- Firebase (Firestore)

## Configuração para Implantação

### Variáveis de Ambiente

As seguintes variáveis de ambiente devem ser configuradas no serviço de hospedagem:

- `PORT`: Porta para o servidor (padrão: 5001)
- `NODE_ENV`: Ambiente (production)
- `FIREBASE_SERVICE_ACCOUNT`: Credenciais do Firebase em formato JSON
- `CORS_ORIGIN`: URL do frontend para CORS

### Serviços de Hospedagem Recomendados

- **Render**: https://render.com
- **Railway**: https://railway.app
- **Heroku**: https://heroku.com

## Instruções para Implantação

### Render

1. Crie uma conta no Render
2. Crie um novo Web Service
3. Conecte este repositório
4. Configure as variáveis de ambiente
5. Defina o comando de build: `npm install`
6. Defina o comando de start: `node server-prod.js`

### Railway

1. Crie uma conta no Railway
2. Crie um novo projeto
3. Adicione um serviço a partir deste repositório
4. Configure as variáveis de ambiente
5. O deploy será automático

### Heroku

1. Crie uma conta no Heroku
2. Crie um novo app
3. Conecte este repositório
4. Configure as variáveis de ambiente
5. O Procfile já está configurado para o Heroku

## Integração com o Frontend

O frontend está implantado permanentemente em:
https://rqiebhmq.manus.space

Após a implantação do backend, atualize a URL da API no frontend para apontar para o novo endpoint permanente.

## Suporte

Para suporte ou dúvidas, entre em contato com a equipe de desenvolvimento.
