import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/SectionHeading';
import { useTranslation } from '@/i18n/i18n';
import { siteConfig } from '@/config';

interface BlogPost { title: string; excerpt: string; date: string; dateLabel: string; readTime: string; link: string }

export function Blog() {
  const { t, tr } = useTranslation();
  const posts = tr<BlogPost[]>('blog.posts') ?? [];
  return (
    <section id="blog" className="py-8 r-double-b" aria-label={t('blog.ariaLabel')}>
      <SectionHeading kicker={t('blog.kicker')} title={`${t('blog.titleBefore')} ${t('blog.titleHighlight')}`} actions={<Button asChild variant="link" className="h-auto min-h-6 p-0 font-mono text-xs font-semibold text-primary"><a href={siteConfig.blogUrl} target="_blank" rel="noopener noreferrer">{t('blog.visitBlog')} <ExternalLink aria-hidden="true" className="ml-1 h-3.5 w-3.5" /></a></Button>} />
      <div className="grid gap-5 md:grid-cols-3">
        {posts.map(post => (
          <article key={post.title} className="r-box flex flex-col justify-between space-y-4 bg-card p-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 font-mono text-xs text-faint"><time dateTime={post.date}>{post.dateLabel}</time><span>{post.readTime}</span></div>
              <h3 className="font-display text-xl font-bold leading-snug"><a href={post.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{post.title}</a></h3>
              <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">{post.excerpt}</p>
            </div>
            <div className="pt-3 r-t"><a href={post.link} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-6 items-center font-mono text-xs font-semibold text-primary hover:underline">{t('blog.readMore')}<span className="sr-only">: {post.title}</span> <ExternalLink aria-hidden="true" className="ml-1 inline h-3.5 w-3.5" /></a></div>
          </article>
        ))}
      </div>
    </section>
  );
}
