"use strict";

const IORedis = require('ioredis');
const KOCReturn = require("koc-common-return");

let clientList = {};

module.exports = {
  ///////////////////////////
  //初始化
  ///////////////////////////
  Init: (dblist) => {
    if (!dblist) {
      return;
    }
    if (!(dblist instanceof Array)) {
      dblist = [dblist];
    }
    dblist.forEach((ThisValue) => {
      try {
        clientList[ThisValue.name] = new IORedis(ThisValue);
      } catch (ex) {
      }
    });
    return clientList;
  },
  ///////////////////////////
  //开户事务
  ///////////////////////////
  Multi: (db) => {
    const retValue = KOCReturn.Value();
    db = clientList[db];
    if (!db) {
      retValue.hasError = true;
      retValue.message = "db null";
    } else {
      retValue.returnObject = db.multi();
    }
    return retValue;
  },
  ///////////////////////////
  //提交事务
  ///////////////////////////
  Exec: (conn) => {
    return new Promise((resolve) => {
      conn.exec(function (err) {
        const retValue = KOCReturn.Value();
        if (err) {
          retValue.hasError = true;
          retValue.message = err;
        }
        resolve(retValue);
      });
    });
  },
  ///////////////////////////
  //撤销事务
  ///////////////////////////
  Discard: function (conn) {
    if (conn) {
      conn.discard();
    }
  },
  ///////////////////////////
  //撤销监听
  ///////////////////////////
  Unwatch: function (db) {
    db = clientList[db];
    if (!db) {
      return;
    }
    db.unwatch();
  }
};