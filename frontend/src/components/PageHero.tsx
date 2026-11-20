import type { CSSProperties } from "react";
import { Link } from "react-router";
import { photo } from "../utils";

interface PageHeroProps {
  title: string;
  description: string;
  image: string;
}

export default function PageHero({ title, description, image }: PageHeroProps) {
  return (
    <section className="page-hero" style={{ "--bg": `url('${photo(image, 2000)}')` } as CSSProperties}>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Trang chủ</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span>
      </nav>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}
