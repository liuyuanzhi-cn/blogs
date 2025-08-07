import {useEffect, useRef, type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            关于我
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
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
  
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <div style={{marginTop:'20px'}} ref={commentElement}></div>
      </main>
    </Layout>
  );
}
