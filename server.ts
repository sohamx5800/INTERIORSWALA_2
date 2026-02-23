import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("interiorswala.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY,
    phone TEXT,
    email TEXT,
    address TEXT,
    socialLinks TEXT
  );

  CREATE TABLE IF NOT EXISTS portfolio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    category TEXT,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS quotations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT,
    projectType TEXT,
    budget TEXT,
    message TEXT,
    aiConcept TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Add aiConcept column if it doesn't exist (for existing databases)
try {
  db.exec("ALTER TABLE quotations ADD COLUMN aiConcept TEXT");
} catch (e) {
  // Column already exists or other error
}

// Seed initial data if profile is empty
const profileCount = db.prepare("SELECT COUNT(*) as count FROM profile").get() as { count: number };
if (profileCount.count === 0) {
  const initialSocialLinks = JSON.stringify([
    { platform: "Instagram", url: "https://instagram.com/interiorswala" },
    { platform: "Facebook", url: "https://facebook.com/interiorswala" },
    { platform: "LinkedIn", url: "https://linkedin.com/company/interiorswala" }
  ]);
  db.prepare("INSERT INTO profile (id, phone, email, address, socialLinks) VALUES (?, ?, ?, ?, ?)")
    .run(1, "+91 79808 72754", "contact.interiorswala@gmail.com", "Mangal Pandey Sarni, Ward 38, East Vivekananda Pally, Rabindra Sarani, Siliguri, West Bengal 734001", initialSocialLinks);
}

// Seed initial portfolio if empty
const portfolioCount = db.prepare("SELECT COUNT(*) as count FROM portfolio").get() as { count: number };
if (portfolioCount.count === 0) {
  const initialPortfolio = [
    { title: "The Minimalist Penthouse", category: "Residential", image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=800&q=80" },
    { title: "Modern Heritage Villa", category: "Residential", image: "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?auto=format&fit=crop&w=800&q=80" },
    { title: "Azure Kitchen Suite", category: "Kitchen", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80" },
    { title: "Velvet Master Suite", category: "Bedroom", image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80" },
    { title: "Monochrome Wardrobe", category: "Storage", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80" },
    { title: "Contemporary Lounge", category: "Living", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80" }
  ];
  const insertPortfolio = db.prepare("INSERT INTO portfolio (title, category, image) VALUES (?, ?, ?)");
  for (const item of initialPortfolio) {
    insertPortfolio.run(item.title, item.category, item.image);
  }
}

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });
  const PORT = 3000;

  app.use(express.json());

  function broadcast(data: any) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
  });

  // --- API Routes ---

  // Profile
  app.get("/api/profile", (req, res) => {
    const profile = db.prepare("SELECT * FROM profile WHERE id = 1").get() as any;
    if (profile) {
      profile.socialLinks = JSON.parse(profile.socialLinks);
    }
    res.json(profile);
  });

  app.post("/api/profile", (req, res) => {
    const { phone, email, address, socialLinks } = req.body;
    db.prepare("UPDATE profile SET phone = ?, email = ?, address = ?, socialLinks = ? WHERE id = 1")
      .run(phone, email, address, JSON.stringify(socialLinks));
    res.json({ success: true });
  });

  // Portfolio
  app.get("/api/portfolio", (req, res) => {
    const portfolio = db.prepare("SELECT * FROM portfolio").all();
    res.json(portfolio);
  });

  app.post("/api/portfolio", (req, res) => {
    const { title, category, image } = req.body;
    const result = db.prepare("INSERT INTO portfolio (title, category, image) VALUES (?, ?, ?)")
      .run(title, category, image);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete("/api/portfolio/:id", (req, res) => {
    db.prepare("DELETE FROM portfolio WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Quotations
  app.get("/api/quotations", (req, res) => {
    const quotations = db.prepare("SELECT * FROM quotations ORDER BY createdAt DESC").all();
    res.json(quotations);
  });

  app.post("/api/quotations", (req, res) => {
    const { name, email, phone, projectType, budget, message, aiConcept } = req.body;
    const result = db.prepare("INSERT INTO quotations (name, email, phone, projectType, budget, message, aiConcept) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(name, email, phone, projectType, budget, message, aiConcept);
    
    const newQuotation = db.prepare("SELECT * FROM quotations WHERE id = ?").get(result.lastInsertRowid);
    broadcast({ type: "NEW_QUOTATION", quotation: newQuotation });
    
    res.json({ id: result.lastInsertRowid });
  });

  app.delete("/api/quotations/:id", (req, res) => {
    db.prepare("DELETE FROM quotations WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
