import { Router, Request, Response } from 'express';
import { shopController } from '../controllers/shopController';

export const apiRouter = Router();

// GET all shops
apiRouter.get('/shops', (req: Request, res: Response) => {
  const { locality, category } = req.query as { locality?: string; category?: string };
  const shops = shopController.getAllShops(locality, category);
  res.json({ success: true, count: shops.length, data: shops });
});

// GET single shop
apiRouter.get('/shops/:id', (req: Request, res: Response) => {
  const shop = shopController.getShopById(req.params.id);
  if (!shop) {
    return res.status(404).json({ success: false, message: 'Shop not found' });
  }
  res.json({ success: true, data: shop });
});

// POST register shop
apiRouter.post('/shops', (req: Request, res: Response) => {
  try {
    const newShop = shopController.createShop(req.body);
    res.status(201).json({ success: true, data: newShop });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update shop
apiRouter.put('/shops/:id', (req: Request, res: Response) => {
  const updated = shopController.updateShop(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Shop not found' });
  }
  res.json({ success: true, data: updated });
});

// POST add item to shop
apiRouter.post('/shops/:id/items', (req: Request, res: Response) => {
  const item = shopController.addItem(req.params.id, req.body);
  res.status(201).json({ success: true, data: item });
});

// POST inquiry / pre-order
apiRouter.post('/inquiries', (req: Request, res: Response) => {
  const inquiry = shopController.createInquiry(req.body);
  res.status(201).json({ success: true, data: inquiry });
});

// GET inquiries for vendor
apiRouter.get('/inquiries/:shopId', (req: Request, res: Response) => {
  const list = shopController.getInquiriesForShop(req.params.shopId);
  res.json({ success: true, data: list });
});
