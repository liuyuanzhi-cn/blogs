import { ReactNode, useEffect, useRef } from "react";


export default function Comments(): ReactNode {
    const commentElement = useRef(null);

    useEffect(() => {
        // Update the document title using the browser API
        let s = document.createElement("script");
        s.src = "https://giscus.app/client.js";
        s.setAttribute("data-repo", "liuyuanzhi-cn/blogs-comments");
        s.setAttribute("data-repo-id", "R_kgDOPZQGmQ");
        s.setAttribute("data-category", "General");
        s.setAttribute("data-category-id", "DIC_kwDOPZQGmc4Ct18K");
        s.setAttribute("data-mapping", "pathname");
        s.setAttribute("data-reactions-enabled", "1");
        s.setAttribute("data-emit-metadata", "0");
        s.setAttribute("data-input-position", "bottom");
        s.setAttribute("data-theme", "light");
        s.setAttribute("data-lang", "zh-CN");
        s.setAttribute("crossorigin", "anonymous");
        s.async = true;
        commentElement.current.appendChild(s);
    }, []);
    return (<><div style={{ marginTop: '20px' }} ref={commentElement}></div></>);
}