const express = require("express");
const { checkTokenMiddleware } = require("../utils/tokenmiddleware");
const {
  checkParametersMiddleware,
} = require("../utils/checkParametersMiddleware");
const { InitializeDM } = require("../controllers/Chats/InitializeDM");
const { SendDM } = require("../controllers/Chats/SendMessage");
const { SeenMessage } = require("../controllers/Chats/SeenMessage");
const { ChatList } = require("../controllers/Chats/ChatList");
const { SendGroupMessage } = require("../controllers/Groups/SendGroupMessage");
const { SeenGroupMessage } = require("../controllers/Groups/SeenGroupMessage");
const {
  SeenMessageHistory,
} = require("../controllers/Groups/SeenMessageHistory");
const {
  GetMembersProfileList,
} = require("../controllers/Groups/GetMembersProfileList");
const groupsrouter = express.Router();

groupsrouter.post(
  "/senddm",
  checkTokenMiddleware,
  checkParametersMiddleware(["groupid", "message"]),
  async (req, res, next) => {
    try {
      const { groupid, message, refid } = req.body;
      await SendGroupMessage({ user: req.uid, groupid, message, refid: refid });
      res.status(200).json({ result: "chat sent" });
    } catch (error) {
      throw new Error(error);
    }
  }
);
groupsrouter.post(
  "/seendm",
  checkTokenMiddleware,
  checkParametersMiddleware(["chatid", "groupid"]),
  async (req, res, next) => {
    try {
      const { groupid, chatid } = req.body;
      await SeenGroupMessage({ user: req.uid, chatid, groupid });
      res.status(200).json({ result: true });
    } catch (error) {
      throw new Error(error);
    }
  }
);
groupsrouter.post(
  "/seenhistory",
  checkTokenMiddleware,
  checkParametersMiddleware(["chatid", "groupid"]),
  async (req, res, next) => {
    try {
      const { groupid, chatid } = req.body;
      const result = await SeenMessageHistory({
        user: req.uid,
        chatid,
        groupid,
      });
      res.status(200).json({ result: result });
    } catch (error) {
      throw new Error(error);
    }
  }
);

groupsrouter.get("/memberslist", checkTokenMiddleware, async (req, res) => {
  try {
    const result = await GetMembersProfileList({ userid: req.uid });
    res.status(200).json({ result });
  } catch (error) {
    throw new Error(error);
  }
});

groupsrouter.use((err, req, res, next) => {
  console.error(err); // Log the error for debugging purposes
  res.status(500).json({ error: "Something went wrong" });
});
module.exports = { groupsrouter };
