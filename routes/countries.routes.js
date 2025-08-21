import express from 'express';
import { getAllCountries, getCountryByCode, searchCountries } from '../controllers/countries.controller.js';

const router = express.Router();

router.get('/', getAllCountries);
router.get('/search', searchCountries);
router.get('/:code', getCountryByCode);

export default router;