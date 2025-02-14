import { Match, Switch, createSignal, lazy } from "solid-js";
import ApiListView from "./views/ApiListView";
import ApiView from "./views/ApiView";
import PageNotFound from "./views/PageNotFound";

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

function App() {
  const [page, setPage] = createSignal(params.page);
  return (
    <div class="fade-in">
      <Switch fallback={<PageNotFound />}>
        <Match when={!page()}>
          <ApiListView />
        </Match>
        <Match when={page() === "api"}>
          <ApiView category={params.category} />
        </Match>
        <Match when={page() === "MiniApp"}>
          {lazy(() => import("./views/OtherViews/MiniApp"))}
        </Match>
      </Switch>
    </div>
  );
}

export default App;
