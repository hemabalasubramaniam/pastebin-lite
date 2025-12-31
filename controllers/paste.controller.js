const pasteService = require("../services/paste.service");
const PORT = process.env.PORT || 3000;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

exports.health = (req, res) => {
  res.status(200).json({ status: "OK" });
};

exports.createPaste = (req, res) => {
  try {
    const paste = pasteService.create(req.body);

    res.status(200).json({
      id: paste.id,
      url: `${APP_URL}/paste/${paste.id}/view`,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.fetchPaste = (req, res) => {
  const result = pasteService.get(req.params.id, req);

  if (result.error) {
    return res.status(404).json({ error: result.error });
  }

  const { paste } = result;

  res.status(200).json({
    content: paste?.content,
    remaining_views: paste.max_views !== null ? Math.max(paste.max_views - paste.views, 0) : null,
    expires_at: paste.expiresAt,
  });
};

exports.viewPaste = (req, res) => {
  const result = pasteService.view(req.params.id, req);

  if (result.error) {
    return res.status(404).send(result.error);
  }

  res.status(200).type("text/plain").send(result.content);
};
