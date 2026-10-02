import { siteConfig } from "@/lib/site";

type Props = {
  variant?: "home" | "blogs";
};

export function AboutSection({ variant = "home" }: Props) {
  if (variant === "blogs") {
    return (
      <footer className="mt-space-xl pt-space-lg flex flex-col gap-space-sm bg-surface-container-lowest p-space-lg rounded">
        <div className="font-label-mono text-label-mono text-outline uppercase tracking-wider flex items-center gap-2">
          <span className="inline-block w-1 h-3 bg-primary" />
          <span>ABOUT ME</span>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          I&apos;m{" "}
          <span className="text-on-surface font-medium">Adhokshaj</span>, a
          MCA student interested in offensive security, web
          security, Linux, automation, and learning by building things.
        </p>
        <div className="flex items-center gap-space-sm font-label-mono text-label-mono text-outline pt-1">
          <a
            className="text-primary hover:underline underline-offset-4 transition-colors"
            href={siteConfig.github}
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          <span className="text-outline-variant">·</span>
          <a
            className="text-primary hover:underline underline-offset-4 transition-colors"
            href={siteConfig.linkedin}
            rel="noreferrer"
            target="_blank"
          >
            LinkedIn
          </a>
          <span className="text-outline-variant">·</span>
          <a
            className="text-primary hover:underline underline-offset-4 transition-colors"
            href={siteConfig.tryhackme}
            rel="noreferrer"
            target="_blank"
          >
            TryHackMe
          </a>
          <span className="text-outline-variant">·</span>
          <a
            className="text-primary hover:underline underline-offset-4 transition-colors"
            href={siteConfig.hackthebox}
            rel="noreferrer"
            target="_blank"
          >
            Hack the Box
          </a>
          { 
          /*<a
            className="hover:text-on-surface transition-colors"
            href={`mailto:${siteConfig.email}`}
          >
            Email Keybase
          </a>
          <span className="text-outline-variant">·</span>
          <a className="hover:text-on-surface transition-colors" href="#">
            PGP: {siteConfig.pgp}
          </a> */}
        </div>
      </footer>
    );
  }

  return (
    <section
    id="about">
      <footer className="mt-space-xl pt-space-lg flex flex-col gap-space-sm bg-surface-container-lowest p-space-lg rounded">
        <div className="font-label-mono text-label-mono text-outline uppercase tracking-wider flex items-center gap-2">
          <span className="inline-block w-1 h-3 bg-primary" />
          <span>ABOUT ME</span>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          I&apos;m{" "}
          <span className="text-on-surface font-medium">Adhokshaj</span>, a
          MCA student interested in offensive security, web
          security, Linux, automation, and learning by building things.
        </p>
        <div className="flex items-center gap-space-sm font-label-mono text-label-mono text-outline pt-1">
          <a
            className="text-primary hover:underline underline-offset-4 transition-colors"
            href={siteConfig.github}
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          <span className="text-outline-variant">·</span>
          <a
            className="text-primary hover:underline underline-offset-4 transition-colors"
            href={siteConfig.linkedin}
            rel="noreferrer"
            target="_blank"
          >
            LinkedIn
          </a>
          <span className="text-outline-variant">·</span>
          <a
            className="text-primary hover:underline underline-offset-4 transition-colors"
            href={siteConfig.tryhackme}
            rel="noreferrer"
            target="_blank"
          >
            TryHackMe
          </a>
          <span className="text-outline-variant">·</span>
          <a
            className="text-primary hover:underline underline-offset-4 transition-colors"
            href={siteConfig.hackthebox}
            rel="noreferrer"
            target="_blank"
          >
            Hack the Box
          </a>
          { 
          /*<a
            className="hover:text-on-surface transition-colors"
            href={`mailto:${siteConfig.email}`}
          >
            Email Keybase
          </a>
          <span className="text-outline-variant">·</span>
          <a className="hover:text-on-surface transition-colors" href="#">
            PGP: {siteConfig.pgp}
          </a> */}
        </div>
      </footer>
    </section>
  );
  // return (
  //   <section
  //     className="flex flex-col gap-space-sm pt-space-sm pb-space-lg"
  //     id="about"
  //   >
  //     <h2 className="font-headline-md text-headline-md text-on-surface">About</h2>
  //     <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
  //       {siteConfig.about}
  //     </p>
  //     <div className="flex items-center gap-space-md font-label-mono text-label-mono text-outline pt-space-xs">
  //       <a
  //         className="hover:text-primary transition-colors"
  //         href={siteConfig.github}
  //         rel="noreferrer"
  //         target="_blank"
  //       >
  //         GitHub
  //       </a>
  //       <span className="text-outline/40">·</span>
  //       <a
  //         className="hover:text-primary transition-colors"
  //         href={siteConfig.linkedin}
  //         rel="noreferrer"
  //         target="_blank"
  //       >
  //         LinkedIn
  //       </a>
  //       <span className="text-outline/40">·</span>
  //      <a
  //           className="text-primary hover:underline underline-offset-4 transition-colors"
  //           href={siteConfig.tryhackme}
  //           rel="noreferrer"
  //           target="_blank"
  //         >
  //           TryHackMe
  //         </a>
  //         <span className="text-outline-variant">·</span>
  //         <a
  //           className="text-primary hover:underline underline-offset-4 transition-colors"
  //           href={siteConfig.hackthebox}
  //           rel="noreferrer"
  //           target="_blank"
  //         >
  //           Hack the Box
  //         </a>
  //     </div>
  //   </section>
  // );
}
