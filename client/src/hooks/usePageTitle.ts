import { useEffect } from "react";

const usePageTitle = (title?: string) => {
  useEffect(() => {
    document.title = title ? `${title} | JobReady` : "JobReady";
  }, [title]);
};

export default usePageTitle;
