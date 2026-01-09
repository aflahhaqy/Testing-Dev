const express = require('express');
const router = express.Router();
const RiskScoringController = require('../controllers/riskScoringController');

// GET /api/master-data - Get all master data (nested: informations -> groupItems -> items)
router.get('/master-data', RiskScoringController.getMasterData);

// POST /api/calculate - Calculate risk score based on selections
router.post('/calculate', RiskScoringController.calculateRisk);

// GET /api/results - Get all results
router.get('/results', RiskScoringController.getAllResults);

// GET /api/results/:id - Get specific result
router.get('/results/:id', RiskScoringController.getResult);

module.exports = router;
