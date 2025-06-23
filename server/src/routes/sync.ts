import { Router } from "express";
import { googleDriveService } from "../services/google-drive";
import { prisma } from "../lib/prisma";
import { logger } from "../lib/logger";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await prisma.user.findUnique({
      where: { legacyId: userId },
      include: {
        googleDriveTokens: true,
        client: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.googleDriveTokens) {
      return res.status(400).json({ error: "Google Drive not configured" });
    }

    if (!user.client?.driveFolderId) {
      return res
        .status(400)
        .json({ error: "Drive folder not configured for client" });
    }

    // Avvia il processo di sincronizzazione.
    const syncResult = await googleDriveService.syncDocuments(userId);

    res.json({
      message: "Sync started successfully",
      result: syncResult,
    });
  } catch (error) {
    
    res.status(500).json({ error: "Failed to sync documents" });
  }
});

export default router;
