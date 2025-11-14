const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [items] = await db.query('SELECT * FROM menu_items ORDER BY category_id, id');
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const [items] = await db.query(
      'SELECT * FROM menu_items WHERE category_id = ? ORDER BY id',
      [categoryId]
    );
    res.json(items);
  } catch (error) {
    console.error('Error fetching items by category:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { category_id, name_ru, name_en, description_ru, description_en, price, image_url } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO menu_items (category_id, name_ru, name_en, description_ru, description_en, price, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [category_id, name_ru, name_en, description_ru, description_en, price, image_url]
    );
    
    res.json({ 
      success: true, 
      id: result.insertId,
      message: 'Item added'
    });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.query('DELETE FROM menu_items WHERE id = ?', [id]);
    
    res.json({ 
      success: true,
      message: 'Item deleted'
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;