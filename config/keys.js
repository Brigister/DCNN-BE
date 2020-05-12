module.exports = {
  FbApi: {
    refreshEvents:
      "https://graph.facebook.com/567488670299450?fields=events.limit(1000){id,%20name,%20description,%20cover,%20place,%20start_time}&access_token=EAAReCsaMTCgBAPdWH3xe8MBBkH6TSYbCMV0t1bTTPVwIyIclunAqc2rOHveWZAhmmBIlwRMbJTNxAgZApIZAt0B7xamKgoa2NokmMuLpYdtWZAg2MYRneQRZA0jNUZCPrrFTrsp0e3DjfRBwIjsabSlNgsCCWs8FLomdeR7Ui0uAZDZD",
    refreshCover:
      "https://graph.facebook.com/567488670299450?fields=events.limit(1000){id,%20cover}&access_token=EAAReCsaMTCgBAPdWH3xe8MBBkH6TSYbCMV0t1bTTPVwIyIclunAqc2rOHveWZAhmmBIlwRMbJTNxAgZApIZAt0B7xamKgoa2NokmMuLpYdtWZAg2MYRneQRZA0jNUZCPrrFTrsp0e3DjfRBwIjsabSlNgsCCWs8FLomdeR7Ui0uAZDZD",
  },

  facebook: {
    clientID: "1229300280609832",
    clientSecret: "2b43aac159680166bb3d834cde9782df",
  },

  mysql: {
    /* mysql://b0965f7538e9ad:ab8d068c@eu-cdbr-west-03.cleardb.net/heroku_abc916623316d5e?reconnect=true */
    host: "eu-cdbr-west-03.cleardb.net",
    user: "b0965f7538e9ad",
    database: "heroku_abc916623316d5e",
    password: "ab8d068c",
  },

  jwt: {
    jwtSecret: "gerh45hkp+4jhkpèjèpk65èkjop56k+p43g5rkèph",
  },

  mail: {
    host: "smtp.gmail.com",
    email: "francescofavaro3@gmail.com",
    password: "BadHouse<3",
  },
};
