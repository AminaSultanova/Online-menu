const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories ORDER BY id');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name_ru, name_en, image_url } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO categories (name_ru, name_en, image_url) VALUES (?, ?, ?)',
      [name_ru, name_en, image_url]
    );
    
    res.json({ 
      success: true, 
      id: result.insertId,
      message: 'Category added'
    });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.query('DELETE FROM categories WHERE id = ?', [id]);
    
    res.json({ 
      success: true,
      message: 'Category deleted'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;