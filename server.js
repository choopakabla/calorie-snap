import express from "express";
import multer from "multer";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.static("public"));

app.post("/api/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Nije poslana fotografija." });
    const mime = req.file.mimetype;
    if (!["image/jpeg", "image/png", "image/webp"].includes(mime)) {
      return res.status(400).json({ error: "Podržane su JPG, PNG ili WEBP fotografije." });
    }
    const base64 = req.file.buffer.toString("base64");
    const dataUrl = `data:${mime};base64,${base64}`;
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-6.2-astra",
      input: [{
        role: "user",
        content: [
          { type: "input_text", text: `Analiziraj fotografiju hrane za dnevnik kalorija. Procijeni vidljive namirnice i veličinu porcije. Ako je deklaracija vidljiva, očitaj vrijednosti s nje i koristi ih. Ako nije, jasno procijeni. Vrati SAMO validan JSON, bez markdowna, u formatu:
{
"name":"kratak naziv obroka",
"portion":"procijenjena količina",
"calories":0,
"protein_g":0,
"carbs_g":0,
"fat_g":0,
"foods":[{"name":"namirnica","portion":"količina","calories":0}],
"confidence":"low|medium|high",
"notes":"kratka napomena o nesigurnosti procjene"
}
Nemoj izmišljati preciznost; kalorije i makronutrijenti su procjene. Ako fotografija nije hrana/deklaracija, vrati opis i confidence low te objasni u notes.` },
          { type: "input_image", image_url: dataUrl, detail: "high" }
        ]
      }]
    });
    const text = response.output_text?.trim() || "";
    const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    const data = JSON.parse(cleaned);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI analiza nije uspjela. Provjeri API ključ i pokušaj ponovno." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Calorie Snap running on http://localhost:${port}`));
