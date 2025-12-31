const { v4: uuidv4 } = require("uuid");
const { getNow } = require("../utils/time");

const pastes = {};

const validatePaste = (paste, id, now) => {
  if (!paste) {
    return { error: "Paste not found" };
  }

  if (paste.expiresAt !== null && now > paste.expiresAt) {
    delete pastes[id];
    return { error: "Paste expired (time limit reached)" };
  }

  if (paste.max_views !== null && paste.views >= paste.max_views) {
    delete pastes[id];
    return { error: "Paste expired (view limit reached)" };
  }

  return { paste };
};


exports.create = ({ content, ttl_seconds, max_views }) => {
  if (!content) throw new Error("Content is required");

  const id = uuidv4().slice(0, 8);

  const paste = {
    id,
    content,
    expiresAt: ttl_seconds
      ? Date.now() + ttl_seconds * 1000
      : null,
    max_views: typeof max_views === "number" ? max_views : null,
    views: 0,
    createdAt: Date.now(),
  };

  pastes[id] = paste;
  return paste;
};

exports.get = (id, req) => {
  const now = getNow(req);
  return validatePaste(pastes[id], id, now);
};

exports.view = (id, req) => {
  const now = getNow(req);
  const result = validatePaste(pastes[id], id, now);

  if (result.error) return result;

  result.paste.views++;
  return { content: result.paste.content };
};
