import { Show, createSignal } from "solid-js";
import apis from "../../minip-apis";

export default function ApiView({ category }) {
  let categoryDetail = null;
  const [res, setRes] = createSignal("");
  for (let cat of apis) {
    if (cat.category === category) {
      categoryDetail = cat;
      break;
    }
  }
  if (!categoryDetail) {
    return (
      <div
        style={{
          "text-align": "center",
        }}
      >
        Error
      </div>
    );
  }
  if (categoryDetail.init) {
    categoryDetail.init((r) => {
      setRes(res() + r + "\n");
    });
  }
  return (
    <>
      <Show when={!categoryDetail.hideResBox}>
        <div class="res-div">{res()}</div>
      </Show>
      <div
        style={{
          display: "flex",
          "flex-direction": "column",
          gap: "5px",
          "margin-left": "8px",
          "margin-right": "8px",
          "margin-top": "10px",
        }}
      >
        {categoryDetail.items.map((item) => (
          <button
            onClick={() =>
              item.exec(function (r) {
                if (typeof r === "string") {
                  setRes(r);
                  return;
                }
                setRes(JSON.stringify(r));
              })
            }
          >
            {item.name}
          </button>
        ))}
      </div>
      <div
        id="more"
        style={{
          display: "flex",
          "margin-left": "8px",
          "margin-right": "8px",
          "margin-top": "10px",
        }}
      ></div>
    </>
  );
}
