import useSupabaseDB from "@/hooks/useSupabaseDB";
import { AssetContextInterface } from "@/interfaces/interfaces";
import { useQuery } from "@tanstack/react-query";
import { ReactElement, ReactNode, createContext } from "react";

export const AssetContext = createContext<AssetContextInterface>({
  assets: [],
  isLoading: false,
});
export default function AssetProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const { getAllAssets } = useSupabaseDB();
  const queryAssets = useQuery({
    queryKey: ["assets"],
    queryFn: getAllAssets,
  });

  return <AssetContext.Provider
    value={{
      assets: queryAssets.data,
      isLoading: queryAssets.isLoading,
    }}
  >{children}</AssetContext.Provider>;
}
