const express = require('express');
const cors = require('cors');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Controladores
const ProductController = require('./src/controllers/productController');
const OrderController = require('./src/controllers/orderController');
const SellerController = require('./src/controllers/sellerController');
const CommissionController = require('./src/controllers/commissionController');
const ReportController = require('./src/controllers/reportController');
const FinanceAccountController = require('./src/controllers/financeAccountController');
const FinanceTransactionController = require('./src/controllers/financeTransactionController');
const AccountPayableController = require('./src/controllers/accountPayableController');

// Rotas
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const sellerRoutes = require('./src/routes/sellerRoutes');
const commissionRoutes = require('./src/routes/commissionRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const financeRoutes = require('./src/routes/financeRoutes');
const accountPayableRoutes = require('./src/routes/accountPayableRoutes');

// Inicialização do Firebase
let db;
if (process.env.FIRESTORE_EMULATOR_HOST) {
  console.log(`Connecting to Firestore Emulator at ${process.env.FIRESTORE_EMULATOR_HOST}...`);
  initializeApp({
    projectId: 'gestion-app-emulator'
  });
  db = getFirestore();
  console.log('Firebase Firestore Emulator Connected');
} else {
  console.log('Attempting to connect to Production Firestore...');
  try {
    // Usar variáveis de ambiente para credenciais em produção
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    
    initializeApp({
      credential: cert(serviceAccount)
    });
    
    db = getFirestore();
    console.log('Production Firestore Connected');
  } catch (error) {
    console.error('Production Firestore connection failed:', error.message);
    
    // Fallback para emulador se a conexão de produção falhar
    console.log('Falling back to Firestore Emulator...');
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
    
    initializeApp({
      projectId: 'gestion-app-emulator'
    });
    
    db = getFirestore();
    console.log('Firebase Firestore Emulator Connected (fallback)');
  }
}

// Inicialização do Express
const app = express();
app.use(express.json());
app.use(cors({
  origin: '*', // Em produção, especificar domínios permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Injeção de dependências
const financeTransactionController = FinanceTransactionController(db);
const accountPayableController = AccountPayableController(db, financeTransactionController);
console.log('Injected FinanceTransactionController into AccountPayableController.');

const productController = ProductController(db);
productController.setAccountPayableController(accountPayableController);
console.log('AccountPayableController set in ProductController');
console.log('Injected AccountPayableController into ProductController.');

const orderController = OrderController(db);
orderController.setFinanceTransactionController(financeTransactionController);
console.log('FinanceTransactionController set in OrderController');
console.log('Injected FinanceTransactionController into OrderController.');

// Inicialização dos controladores
const controllers = {
  product: productController,
  order: orderController,
  seller: SellerController(db),
  commission: CommissionController(db),
  report: ReportController(db),
  financeAccount: FinanceAccountController(db),
  financeTransaction: financeTransactionController,
  accountPayable: accountPayableController
};

console.log('Initialized controllers:', Object.keys(controllers));

// Configuração das rotas
app.use('/api/products', productRoutes(controllers.product));
app.use('/api/orders', orderRoutes(controllers.order));
app.use('/api/sellers', sellerRoutes(controllers.seller));
app.use('/api/commissions', commissionRoutes(controllers.commission));
app.use('/api/reports', reportRoutes(controllers.report));
app.use('/api/finance', financeRoutes(controllers.financeAccount, controllers.financeTransaction));
app.use('/api/finance', accountPayableRoutes(controllers.accountPayable));

// Rota de status
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Inicialização do servidor
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
