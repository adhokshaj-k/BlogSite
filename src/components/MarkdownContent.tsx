type Props = {
  html: string;
};

export function MarkdownContent({ html }: Props) {
  return (
    <div
      className="prose-article"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
