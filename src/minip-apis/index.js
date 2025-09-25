import {
  closeApp,
  deleteKVStorage,
  enablePullDownRefresh,
  disablePullDownRefresh,
  getClipboardData,
  getKVStorage,
  navigateBack,
  navigateTo,
  openWebsite,
  previewImage,
  previewVideo,
  setClipboardData,
  setKVStorage,
  showAlert,
  showAppDetail,
  showHUD,
  startPullDownRefresh,
  stopPullDownRefresh,
  vibrate,
  setNavigationBarTitle,
  setNavigationBarColor,
  redirectTo,
  clearKVStorage,
  setKVStorageSync,
  getKVStorageSync,
  deleteKVStorageSync,
  clearKVStorageSync,
  showPicker,
  scanQRCode,
  openSettings,
  getDeviceInfo,
  getDeviceInfoSync,
  getMemoryStorage,
  setMemoryStorage,
  setMemoryStorageIfNotExist,
  removeMemoryStorage,
  clearMemoryStorage,
} from "minip-bridge";

export default [
  {
    category: "Route",
    items: [
      {
        name: "navigate",
        exec: () => {
          navigateTo({
            page: "index.html?page=api&category=Route",
            title: String(parseInt(Math.random() * 100)),
          }).then((res) => setRes(JSON.stringify(res)));
        },
      },
      {
        name: "navigateBack",
        exec: () => {
          navigateBack();
        },
      },
      {
        name: "redirectTo",
        exec: () => {
          redirectTo({
            page: "index.html?page=404",
            title: "Redirect to 404",
          });
        },
      },
      {
        name: "location",
        exec: (setRes) => {
          setRes(window.location.href);
        },
      },
      {
        name: "open settings",
        exec: () => {
          openSettings();
        },
      },
      {
        name: "open website",
        exec: () => {
          openWebsite("https://www.bing.com");
        },
      },
      {
        name: "show app detail",
        exec: () => {
          showAppDetail();
        },
      },
      {
        name: "close app",
        exec: () => {
          closeApp();
        },
      },
    ],
  },
  {
    category: "Events",
    init: (setRes) => {
      window.addEventListener("pulldownrefresh", (e) => {
        setRes("pulldownrefresh");
        setTimeout(() => {
          stopPullDownRefresh();
        }, 2000);
      });
      window.addEventListener("pageshow", (e) => {
        setRes("pageshow");
        setRes(localStorage.getItem("pagehide-flag") ?? "");
        localStorage.removeItem("pagehide-flag");
      });
      window.addEventListener("pagehide", (e) => {
        localStorage.setItem("pagehide-flag", "[last time pagehide success]");
      });
    },
    items: [
      {
        name: "navigate",
        exec: () => {
          navigateTo({
            page: "index.html?page=api&category=Events",
            title: "Events",
          });
        },
      },
      {
        name: "enable pulldown refresh",
        exec: () => {
          enablePullDownRefresh();
        },
      },
      {
        name: "disable pulldown refresh",
        exec: () => {
          disablePullDownRefresh();
        },
      },
      {
        name: "start pulldown refresh",
        exec: () => {
          startPullDownRefresh();
        },
      },
      {
        name: "stop pull down refresh",
        exec: () => {
          stopPullDownRefresh();
        },
      },
    ],
  },
  {
    category: "HTTP",
    items: [
      {
        name: "get",
        exec: (setRes) => {
          fetch("miniphttps://www.bing.com")
            .then((res) => res.text())
            .then((res) => setRes(res))
            .catch((err) =>
              setRes(err ? err.message ?? JSON.stringify(err) : "Unknown error")
            );
        },
      },
    ],
  },
  {
    category: "UI",
    items: [
      {
        name: "HUD",
        exec: () => {
          showHUD({
            type: "success",
            title: "success",
          });
        },
      },
      {
        name: "default alert",
        exec: (setRes) => {
          showAlert({
            title: "default alert",
            message: "message",
            preferredStyle: "alert",
            actions: [
              {
                title: "ok",
                key: "ok",
              },
              {
                title: "destructive",
                key: "destructive",
                style: "destructive",
              },
              {
                title: "cancel",
                key: "cancel",
                style: "cancel",
              },
            ],
          })
            .then((res) => {
              setRes(`selected ${res.data}`);
            })
            .catch((err) =>
              setRes(err ? err.message ?? JSON.stringify(err) : "Unknown error")
            );
        },
      },
      {
        name: "action sheet alert",
        exec: (setRes) => {
          showAlert({
            title: "actionSheet",
            message: "message",
            preferredStyle: "actionSheet",
            actions: [
              {
                title: "ok",
                key: "ok",
              },
              {
                title: "destructive",
                key: "destructive",
                style: "destructive",
              },
              {
                title: "cancel",
                key: "cancel",
                style: "cancel",
              },
            ],
          })
            .then((res) => {
              setRes(`selected ${res.data}`);
            })
            .catch((err) =>
              setRes(err ? err.message ?? JSON.stringify(err) : "Unknown error")
            );
        },
      },
      {
        name: "set navigation bar title",
        exec: (setRes) => {
          setNavigationBarTitle(Math.random().toString())
            .then((res) => {
              setRes(JSON.stringify(res));
            })
            .catch((err) =>
              setRes(err ? err.message ?? JSON.stringify(err) : "Unknown error")
            );
        },
      },
      {
        name: "set navigation bar color",
        exec: (setRes) => {
          setNavigationBarColor({
            foregroundColor: "#F8F8F2",
            backgroundColor: "#663399",
          })
            .then((res) => {
              setRes(JSON.stringify(res));
            })
            .catch((err) =>
              setRes(err ? err.message ?? JSON.stringify(err) : "Unknown error")
            );
        },
      },
      {
        name: "picker (single column)",
        exec: (setRes) => {
          const column = ["🍎", "🥝", "🍓", "🍈", "🍑"];
          showPicker("singleColumn", {
            column,
            index: 0,
          })
            .then((res) => {
              if (res.hasData()) {
                const selected = res.data;
                setRes(`selected ${column[selected]}, res: ${selected}`);
              } else {
                setRes("canceled");
              }
            })
            .catch((err) =>
              setRes(err ? err.message ?? JSON.stringify(err) : "Unknown error")
            );
        },
      },
      {
        name: "picker (multiple columns)",
        exec: (setRes) => {
          const columns = [
            ["🍎", "🥝", "🍓"],
            ["🍈", "🍑"],
          ];
          showPicker("multipleColumns", {
            columns,
            index: [0, 1],
          })
            .then((res) => {
              if (res.hasData()) {
                const selected = res.data;
                let msg = "";
                for (let index = 0; index < selected.length; index++) {
                  const i = selected[index];
                  msg += columns[index][i];
                }
                setRes(`selected ${msg}`);
              } else {
                setRes("canceled");
              }
            })
            .catch((err) =>
              setRes(err ? err.message ?? JSON.stringify(err) : "Unknown error")
            );
        },
      },
      {
        name: "picker (date)",
        exec: (setRes) => {
          showPicker("date", {
            dateFormat: "yyyy-MM-dd",
          })
            .then((res) => {
              if (res.hasData()) {
                const selected = res.data;
                setRes(`selected ${selected}`);
              } else {
                setRes("canceled");
              }
            })
            .catch((err) =>
              setRes(err ? err.message ?? JSON.stringify(err) : "Unknown error")
            );
        },
      },
      {
        name: "picker (time)",
        exec: (setRes) => {
          showPicker("time", {
            dateFormat: "HH:mm",
          })
            .then((res) => {
              if (res.hasData()) {
                const selected = res.data;
                setRes(`selected ${selected}`);
              } else {
                setRes("canceled");
              }
            })
            .catch((err) =>
              setRes(err ? err.message ?? JSON.stringify(err) : "Unknown error")
            );
        },
      },
    ],
  },
  {
    category: "Media",
    hideResBox: false,
    items: [
      {
        name: "preview image",
        exec: () => {
          previewImage(
            "https://static.yueya.net/shuomingshu.cn//wp-content/uploads/images/2023/06/23/4b30c4d172cd4c709d170e8194cae245_ajwo1tt5eln.jpg"
          );
        },
      },
      {
        name: "play video",
        exec: () => {
          previewVideo(
            "https://www.sample-videos.com/video321/mp4/720/big_buck_bunny_720p_30mb.mp4"
          );
        },
      },
    ],
  },
  {
    category: "KV Storage",
    items: [
      {
        name: "set kv storage",
        exec: (setRes) => {
          const start = Date.now();
          setKVStorage("test", String(Math.random()))
            .then((res) => {
              const elapsed = Date.now() - start;
              setRes(`success, cost: ${elapsed} ms`);
            })
            .catch((err) =>
              setRes(err ? err.message ?? JSON.stringify(err) : "Unknown error")
            );
        },
      },
      {
        name: "get kv storage",
        exec: (setRes) => {
          const start = Date.now();
          getKVStorage("test")
            .then((res) => {
              const elapsed = Date.now() - start;
              setRes(res.data + `, cost: ${elapsed} ms`);
            })
            .catch((err) =>
              setRes(err ? err.message ?? JSON.stringify(err) : "Unknown error")
            );
        },
      },
      {
        name: "delete kv storage",
        exec: (setRes) => {
          const start = Date.now();
          deleteKVStorage("test")
            .then((res) => {
              const elapsed = Date.now() - start;
              setRes(`success, cost: ${elapsed} ms`);
            })
            .catch((err) =>
              setRes(err ? err.message ?? JSON.stringify(err) : "Unknown error")
            );
        },
      },
      {
        name: "clear kv storage",
        exec: (setRes) => {
          const start = Date.now();
          clearKVStorage()
            .then((res) => {
              const elapsed = Date.now() - start;
              setRes(`success, cost: ${elapsed} ms`);
            })
            .catch((err) =>
              setRes(err ? err.message ?? JSON.stringify(err) : "Unknown error")
            );
        },
      },
      {
        name: "set kv storage sync",
        exec: (setRes) => {
          const start = Date.now();
          const res = setKVStorageSync("test", String(Math.random()));
          const elapsed = Date.now() - start;
          setRes(`success, cost: ${elapsed} ms, ${JSON.stringify(res)}`);
        },
      },
      {
        name: "get kv storage sync",
        exec: (setRes) => {
          const start = Date.now();
          const res = getKVStorageSync("test");
          const elapsed = Date.now() - start;
          setRes(`success, cost: ${elapsed} ms, ${JSON.stringify(res)}`);
        },
      },
      {
        name: "delete kv storage sync",
        exec: (setRes) => {
          const start = Date.now();
          const res = deleteKVStorageSync("test");
          const elapsed = Date.now() - start;
          setRes(`success, cost: ${elapsed} ms, ${JSON.stringify(res)}`);
        },
      },
      {
        name: "clear kv storage sync",
        exec: (setRes) => {
          const start = Date.now();
          const res = clearKVStorageSync();
          const elapsed = Date.now() - start;
          setRes(`success, cost: ${elapsed} ms, ${JSON.stringify(res)}`);
        },
      },
    ],
  },
  {
    category: "Memory Storage",
    items: [
      {
        name: "get memory storage",
        exec: (setRes) => {
          const start = Date.now();
          getMemoryStorage("test", String(Math.random()))
            .then((res) => {
              const elapsed = Date.now() - start;
              setRes(res.data + `, cost: ${elapsed} ms`);
            })
            .catch((err) =>
              setRes(err ? err.message ?? JSON.stringify(err) : "Unknown error")
            );
        },
      },
      {
        name: "set memory storage",
        exec: (setRes) => {
          const start = Date.now();
          setMemoryStorage("test", String(Math.random()))
            .then((res) => {
              const elapsed = Date.now() - start;
              setRes(`success, cost: ${elapsed} ms`);
            })
            .catch((err) =>
              setRes(err ? err.message ?? JSON.stringify(err) : "Unknown error")
            );
        },
      },
      {
        name: "set memory storage if not exist",
        exec: (setRes) => {
          const start = Date.now();
          setMemoryStorageIfNotExist("test", String(Math.random()))
            .then((res) => {
              const elapsed = Date.now() - start;
              setRes(`success, cost: ${elapsed} ms, res: ${res.data}`);
            })
            .catch((err) =>
              setRes(err ? err.message ?? JSON.stringify(err) : "Unknown error")
            );
        },
      },
      {
        name: "remove memory storage",
        exec: (setRes) => {
          const start = Date.now();
          removeMemoryStorage("test")
            .then((res) => {
              const elapsed = Date.now() - start;
              setRes(`success, cost: ${elapsed} ms`);
            })
            .catch((err) =>
              setRes(err ? err.message ?? JSON.stringify(err) : "Unknown error")
            );
        },
      },
      {
        name: "clear memory storage",
        exec: (setRes) => {
          const start = Date.now();
          clearMemoryStorage()
            .then((res) => {
              const elapsed = Date.now() - start;
              setRes(`success, cost: ${elapsed} ms`);
            })
            .catch((err) =>
              setRes(err ? err.message ?? JSON.stringify(err) : "Unknown error")
            );
        },
      },
    ],
  },
  { category: "SQLite", target: "index.html?page=SQLite" },
  {
    category: "Device",
    items: [
      {
        name: "get clipboard data",
        exec: (setRes) => {
          getClipboardData()
            .then((res) => setRes(res))
            .catch((err) =>
              setRes(err ? err.message ?? JSON.stringify(err) : "Unknown error")
            );
        },
      },
      {
        name: "set clipboard data",
        exec: (setRes) => {
          setClipboardData(Math.random().toString())
            .then(() => setRes("success"))
            .catch((err) =>
              setRes(err ? err.message ?? JSON.stringify(err) : "Unknown error")
            );
        },
      },
      {
        name: "vibrate",
        exec: (setRes) => {
          const type = ["light", "medium", "heavy"][
            (Math.random() * 100).toFixed() % 3
          ];
          setRes(type);
          vibrate(type);
        },
      },
      {
        name: "scan qrcode",
        exec: (setRes) => {
          scanQRCode()
            .then((res) => {
              if (res.data !== null && res.data !== undefined) {
                setRes(res.data);
              } else {
                setRes("canceled");
              }
            })
            .catch((err) =>
              setRes(err ? err.message ?? JSON.stringify(err) : "Unknown error")
            );
        },
      },
      {
        name: "get device info",
        exec: (setRes) => {
          getDeviceInfo()
            .then((res) => {
              setRes(JSON.stringify(res.data));
            })
            .catch((err) =>
              setRes(err ? err.message ?? JSON.stringify(err) : "Unknown error")
            );
        },
      },
      {
        name: "get device info sync",
        exec: (setRes) => {
          const res = getDeviceInfoSync();
          setRes(JSON.stringify(res.data));
        },
      },
    ],
  },
  {
    category: "MiniApp",
    target: "index.html?page=MiniApp",
  },
  {
    category: "FileSystem",
    target: "index.html?page=FileSystem",
  }
];
