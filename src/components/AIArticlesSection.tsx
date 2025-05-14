
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Lightbulb, TrendingUp, BookOpen } from 'lucide-react';

interface ArticleProps {
  title: string;
  source: string;
  date: string;
  description: string;
  url: string;
}

const consultingArticles: ArticleProps[] = [
  {
    title: "The Economic Potential of Generative AI",
    source: "McKinsey",
    date: "2023-06-14",
    description: "Analysis of generative AI's impact on productivity and economic transformation across industries.",
    url: "https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier"
  },
  {
    title: "Generative AI: A Creative New World",
    source: "Boston Consulting Group",
    date: "2023-04-20",
    description: "How generative AI is transforming creative processes and business operations.",
    url: "https://www.bcg.com/publications/2023/generative-ai-impact-on-businesses"
  },
  {
    title: "AI Investment Outlook 2025",
    source: "Deloitte",
    date: "2023-11-30",
    description: "Strategic investment priorities for AI integration and digital transformation.",
    url: "https://www2.deloitte.com/us/en/insights/focus/signals-for-strategists/artificial-intelligence-investment-by-industry.html"
  }
];

const investmentArticles: ArticleProps[] = [
  {
    title: "AI in FinTech: Reshaping Investment Strategies",
    source: "Blackrock",
    date: "2023-10-05",
    description: "How AI is transforming investment decision-making and algorithmic trading.",
    url: "https://www.blackrock.com/us/individual/insights/artificial-intelligence-investing"
  },
  {
    title: "AI Disruption: The Next Wave of Market Leaders",
    source: "Sequoia Capital",
    date: "2023-09-12",
    description: "Analysis of emerging AI companies poised to lead market transformation.",
    url: "https://www.sequoiacap.com/article/generative-ai-a-creative-new-world/"
  },
  {
    title: "The AI Investment Thesis for 2025",
    source: "Andreessen Horowitz",
    date: "2023-12-01",
    description: "Strategic investment framework for the evolving AI landscape.",
    url: "https://a16z.com/2023/06/06/ai-will-save-the-world/"
  }
];

const innovationUpdates: ArticleProps[] = [
  {
    title: "Multimodal AI Models: Beyond Text and Images",
    source: "AI Research Consortium",
    date: "2025-01-15",
    description: "Advances in AI models that seamlessly integrate multiple data types.",
    url: "#"
  },
  {
    title: "Edge AI: Computing at the Periphery",
    source: "MIT Technology Review",
    date: "2025-01-10",
    description: "How edge computing is revolutionizing AI deployment and real-time processing.",
    url: "#"
  },
  {
    title: "AI Agents: Autonomous Decision-Making Systems",
    source: "Stanford HAI",
    date: "2024-12-28",
    description: "The evolution of autonomous AI systems in enterprise environments.",
    url: "#"
  }
];

const ArticleCard: React.FC<ArticleProps> = ({ title, source, date, description, url }) => (
  <Card className="h-full">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">{title}</CardTitle>
      <CardDescription className="flex justify-between">
        <span>{source}</span>
        <span className="text-xs text-muted-foreground">{date}</span>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-2">{description}</p>
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-xs flex items-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        Read more <ExternalLink className="h-3 w-3 ml-1" />
      </a>
    </CardContent>
  </Card>
);

const AIArticlesSection: React.FC = () => {
  return (
    <div className="mb-10 animate-fade-in">
      <h2 className="text-2xl font-semibold tracking-tight mb-6">
        AI Market Intelligence Insights
      </h2>
      
      <Tabs defaultValue="consulting" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="consulting" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Consulting Perspectives
          </TabsTrigger>
          <TabsTrigger value="investment" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Investment Insights
          </TabsTrigger>
          <TabsTrigger value="innovation" className="flex items-center">
            <Lightbulb className="h-4 w-4 mr-2" />
            Latest Innovations
          </TabsTrigger>
        </TabsList>
        <TabsContent value="consulting" className="pt-2 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {consultingArticles.map((article, index) => (
              <ArticleCard key={`consulting-${index}`} {...article} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="investment" className="pt-2 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {investmentArticles.map((article, index) => (
              <ArticleCard key={`investment-${index}`} {...article} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="innovation" className="pt-2 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {innovationUpdates.map((article, index) => (
              <ArticleCard key={`innovation-${index}`} {...article} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIArticlesSection;
