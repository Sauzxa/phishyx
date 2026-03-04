import "dotenv/config";
import app from "./app";

const PORT = Number(process.env.PORT ?? 3002);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] Running on http://localhost:${PORT}`);
});
