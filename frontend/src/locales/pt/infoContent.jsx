import React from 'react';
import Link from '../../components/LocaleLink';

const seo = {
  title: 'Calculadora de Dinheiro TikTok – Estime Seus Ganhos',
  description:
    'Estime seus ganhos no TikTok com nossa calculadora grátis. Descubra rendimentos potenciais a partir de visualizações, seguidores, engajamento e patrocínios.',
  ogLocale: 'pt_BR',
};

const metricsGuide = [
  {
    name: 'Seguidores',
    tag: 'Alcance de Audiência',
    description:
      'Total de contas que seguem o criador no TikTok. Indica tamanho de público e aplica um multiplicador de escala secundário.',
  },
  {
    name: 'Total de Curtidas',
    tag: 'Curtidas acumuladas',
    description: 'Soma de curtidas recebidas em todos os vídeos públicos atualmente no perfil.',
  },
  {
    name: 'Total de Vídeos',
    tag: 'Vídeos publicados',
    description: 'Quantidade total de vídeos públicos publicados na conta.',
  },
  {
    name: 'Seguindo',
    tag: 'Contas seguidas',
    description: 'Total de perfis que o criador segue.',
  },
  {
    name: 'Média Est. de Views',
    tag: 'Views por vídeo',
    description:
      'Média de visualizações dos vídeos públicos recentes, ou estimada pelos seguidores quando os vídeos recentes não estão disponíveis.',
  },
  {
    name: 'Engajamento',
    tag: 'Taxa de interação',
    description:
      'Curtidas, comentários e compartilhamentos divididos pelas visualizações totais dos vídeos analisados (ou estimado em modo de fallback).',
  },
];

const cpmTiers = [
  {
    tier: 'Mercados Tier 1',
    regions: 'US, CA, UK, GB, AU, NZ, DE',
    min: '$22.00',
    avg: '$30.00',
    max: '$42.00',
    featured: true,
  },
  {
    tier: 'Mercados Tier 2',
    regions: 'FR, ES, IT, PT, BR, MX, SG, NL, BE, SE, NO, DK, FI, IE, CH',
    min: '$16.00',
    avg: '$22.00',
    max: '$32.00',
    featured: false,
  },
  {
    tier: 'Tier 3 / Padrão Global',
    regions: 'Todas as outras regiões ou quando não há código regional no perfil',
    min: '$12.00',
    avg: '$18.00',
    max: '$26.00',
    featured: false,
  },
];

const followerScaleTiers = [
  { range: 'Até 10.000 seguidores', factor: '1.00x' },
  { range: '10.001 a 100.000 seguidores', factor: '1.02x' },
  { range: '100.001 a 500.000 seguidores', factor: '1.08x' },
  { range: '500.001 a 2.000.000 seguidores', factor: '1.12x' },
  { range: 'Acima de 2.000.000 seguidores', factor: '1.18x' },
];

const channelRows = [
  {
    feature: 'Fonte de Pagamento',
    sponsorships: 'Marcas externas, anunciantes ou agências de marketing',
    rewards: 'TikTok (ByteDance) diretamente no saldo do criador dentro do app',
  },
  {
    feature: 'Métrica de Preço / Repasse',
    sponsorships: 'Cachê negociado com base em CPM de patrocínio (custo por 1.000 visualizações)',
    rewards: 'RPM variável da plataforma (receita por 1.000 views qualificadas) definido pelo TikTok',
  },
  {
    feature: 'Regras de Duração',
    sponsorships: 'Qualquer duração acordada no briefing da campanha',
    rewards: 'Precisa cumprir a duração mínima e as regras de originalidade do TikTok',
  },
  {
    feature: 'Mínimo de Seguidores',
    sponsorships: 'Sem mínimo obrigatório; depende de afinidade com a marca e alcance',
    rewards: 'Exige cumprir os critérios oficiais de seguidores e views em 30 dias',
  },
  {
    feature: 'Modelado pelo KalkulatorTik?',
    sponsorships: 'Sim — Modelado pela nossa Calculadora de Dinheiro TikTok principal',
    rewards: 'Não — Requer métricas internas privadas de views qualificadas e RPM',
    isStatusRow: true,
  },
];

const factors = [
  {
    num: '01',
    title: 'Demografia Verificada da Audiência',
    body: 'Códigos regionais públicos são apenas uma aproximação. Marcas costumam pedir capturas do TikTok Studio mostrando países, idades e gênero do público.',
  },
  {
    num: '02',
    title: 'Categoria ou Nicho de Conteúdo',
    body: 'Segmentos de alta intenção comercial — finanças pessoais, software, B2B, skincare, fitness e tecnologia — costumam ter cachês maiores que entretenimento amplo.',
  },
  {
    num: '03',
    title: 'Entregáveis e Produção',
    body: 'Uma citação de 15 segundos num vlog exige menos produção que um tutorial roteirizado de 60 segundos com iluminação de estúdio ou gravação externa.',
  },
  {
    num: '04',
    title: 'Direitos de Uso e Licenciamento',
    body: 'O cachê base cobre apenas o post orgânico no perfil do criador. Reutilização em sites, e-mails ou anúncios pagos pede taxa extra de licenciamento.',
  },
  {
    num: '05',
    title: 'Spark Ads e Impulsionamento Pago',
    body: 'Fornecer código de Spark Ads (whitelisting) permite impulsionar com verba de mídia em seu perfil, geralmente cobrado em ciclos de 30, 60 ou 90 dias.',
  },
  {
    num: '06',
    title: 'Exclusividade de Categoria',
    body: 'Concordar em não divulgar concorrentes durante um prazo combinado restringe outras parcerias e justifica um adicional de exclusividade.',
  },
  {
    num: '07',
    title: 'Pacotes com Múltiplos Vídeos',
    body: 'Fechar pacotes com três a cinco vídeos patrocinados no trimestre costuma trazer um desconto moderado por vídeo em troca de receita total maior.',
  },
  {
    num: '08',
    title: 'Sazonalidade e Poder de Negociação',
    body: 'Datas fortes do varejo, prazos apertados, demanda pelo criador e histórico comprovado de vendas alteram os valores negociados.',
  },
];

const creatorRows = [
  {
    metric: 'Total de Seguidores',
    creatorA: '500.000 seguidores',
    creatorB: '50.000 seguidores',
    insight: 'O Criador A tem 10× mais seguidores que o Criador B.',
  },
  {
    metric: 'Fator de Escala de Seguidores',
    creatorA: '1.08x (faixa >100K)',
    creatorB: '1.02x (faixa >10K)',
    insight: 'O Criador A recebe um multiplicador de escala maior.',
  },
  {
    metric: 'Média de Views por Vídeo',
    creatorA: '8.000 views por vídeo',
    creatorB: '65.000 views por vídeo',
    insight: 'O Criador B entrega mais de 8× visualizações por publicação.',
  },
  {
    metric: 'Taxa de Engajamento',
    creatorA: '1,20% de interação',
    creatorB: '9,40% de interação',
    insight: 'A audiência do Criador B curte, comenta e compartilha ativamente.',
  },
  {
    metric: 'Fator de Engajamento',
    creatorA: '0.924x',
    creatorB: '1.088x',
    insight: 'Engajamento forte eleva o multiplicador de CPM do Criador B.',
  },
  {
    metric: 'Faixa Regional do Perfil',
    creatorA: 'Tier 3 / Global ($18.00 CPM base médio)',
    creatorB: 'Tier 1 / EUA ($30.00 CPM base médio)',
    insight: 'Premissas regionais diferenciam ainda mais o CPM base.',
  },
  {
    metric: 'CPM Ajustado do Modelo',
    creatorA: '$17.96 (Faixa: $11.98 – $25.95)',
    creatorB: '$33.29 (Faixa: $24.41 – $46.61)',
    insight: 'Interação ativa e mercado Tier 1 quase dobram o CPM.',
  },
  {
    metric: 'Valor Estimado de Patrocínio',
    creatorA: '$143.68 por vídeo ($95.84 – $207.60)',
    creatorB: '$2,163.85 por vídeo ($1,586.65 – $3,029.65)',
    insight: 'Visualizações reais e engajamento sustentam a estimativa maior.',
    highlight: true,
  },
];

const faqItems = [
  {
    id: 'faq-1',
    question: '1. O que uma calculadora de dinheiro do TikTok estima?',
    schemaAnswer:
      'Uma calculadora de dinheiro do TikTok como o KalkulatorTik estima os possíveis ganhos comerciais com patrocínio de marca para um único vídeo patrocinado em um perfil público, exibindo um valor base em USD e uma faixa conforme alcance, engajamento e CPM regional.',
    answer: (
      <p>
        Uma calculadora de dinheiro do TikTok como o <strong>KalkulatorTik</strong> estima os{' '}
        <strong>potenciais ganhos comerciais com patrocínio de marca para um vídeo dedicado</strong> em um perfil público.
        Em vez de simular repasses internos de anúncios do app, apresenta uma referência em dólares USD por vídeo e uma
        faixa baseada em alcance público, engajamento e CPM regional.
      </p>
    ),
  },
  {
    id: 'faq-2',
    question: '2. Essa estimativa é igual aos pagamentos do TikTok Creator Rewards?',
    schemaAnswer:
      'Não. Patrocínios de marcas e o Programa TikTok Creator Rewards são fontes separadas. O Creator Rewards paga diretamente pelo TikTok com base em visualizações qualificadas de vídeos originais de 1+ minuto (exige pelo menos 10.000 seguidores, 100.000 views em 30 dias, 18+ anos ou 19+ na Coreia do Sul, conta regular e região elegível). Nossa calculadora estima cachês privados com marcas.',
    answer: (
      <p>
        <strong>Não.</strong> Patrocínios com marcas e o Programa TikTok Creator Rewards são receitas distintas. O Creator
        Rewards paga diretamente pelo TikTok em vídeos originais de <code>1+ minuto</code> e exige pelo menos{' '}
        <code>10.000</code> seguidores, <code>100.000</code> visualizações nos últimos 30 dias, idade <code>18+</code> (ou{' '}
        <code>19+</code> na Coreia do Sul), conta regular e região elegível. Nossa calculadora estima{' '}
        <strong>cachês privados de publicidade com marcas</strong>, sem mínimo fixo de seguidores.
      </p>
    ),
  },
  {
    id: 'faq-3',
    question: '3. Como o valor estimado de patrocínio é calculado no KalkulatorTik?',
    schemaAnswer:
      'Dividimos a média de views por vídeo por 1.000 e multiplicamos por um CPM ajustado. A partir de faixas regionais internas ($12–$42 nos Tiers 1–3, médias de $18–$30), aplicamos um fator de engajamento (0.90x a 1.20x) e escala de seguidores (1.00x a 1.18x), limitados entre $7.00 e $80.00.',
    answer: (
      <p>
        Dividimos a <strong>Média de Views por Vídeo</strong> por <code>1.000</code> e multiplicamos por um{' '}
        <strong>CPM Ajustado</strong>. Partindo de faixas regionais internas (<code>$12&ndash;$42</code> com bases
        médias de <code>$18&ndash;$30</code>), aplicamos um fator de engajamento (<code>0.90x</code> a{' '}
        <code>1.20x</code>) e escala de seguidores (<code>1.00x</code> a <code>1.18x</code>), limitando o resultado
        entre <code>$7.00</code> e <code>$80.00</code>.
      </p>
    ),
  },
  {
    id: 'faq-4',
    question: '4. Seguidores ou visualizações importam mais nos preços de patrocínio?',
    schemaAnswer:
      'A média de visualizações costuma pesar mais na precificação de um vídeo patrocinado porque mostra quantas pessoas tendem a assistir ao conteúdo. Um perfil menor com views consistentes costuma superar uma conta grande com baixo alcance recente.',
    answer: (
      <p>
        <strong>A média de visualizações por vídeo costuma pesar mais</strong> para precificar um vídeo patrocinado,
        pois mostra quantas pessoas provavelmente assistirão à entrega. Seguidores ainda trazem prova social e um pequeno
        ajuste de escala, mas consistência de views vale mais.
      </p>
    ),
  },
  {
    id: 'faq-5',
    question: '5. Posso calcular ganhos de patrocínio usando apenas o nome de usuário do TikTok?',
    schemaAnswer:
      'Sim. Como o KalkulatorTik funciona por nome de usuário, basta informar o @ do perfil público desejado para coletar as estatísticas públicas e calcular o valor estimado por vídeo.',
    answer: (
      <p>
        <strong>Sim.</strong> Basta inserir o @ do usuário (com ou sem <code>@</code>) de qualquer conta{' '}
        <strong>Pública</strong> para coletar os indicadores visíveis e calcular a estimativa por vídeo.
      </p>
    ),
  },
  {
    id: 'faq-6',
    question: '6. A calculadora pede senha ou login da conta TikTok?',
    schemaAnswer:
      'Nunca. O KalkulatorTik jamais solicita senha, e-mail, códigos 2FA ou acesso ao TikTok Studio. Tudo opera com dados públicos. Veja nossa Política de Privacidade.',
    answer: (
      <p>
        <strong>Nunca.</strong> O KalkulatorTik não pede senha do TikTok, e-mail, códigos de autenticação ou login no
        TikTok Studio. Tudo usa apenas dados públicos. Leia nossa{' '}
        <Link to="/privacy" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Política de Privacidade
        </Link>{' '}
        para mais detalhes.
      </p>
    ),
  },
  {
    id: 'faq-7',
    question: '7. O uso do KalkulatorTik é gratuito?',
    schemaAnswer:
      'Sim. O KalkulatorTik é gratuito online, sem assinatura ou cartão de crédito. Limites padrão protegem o servidor. Confira mais detalhes na página completa de FAQ.',
    answer: (
      <p>
        <strong>Sim.</strong> O KalkulatorTik é gratuito online, sem assinaturas ou cadastro obrigatório. Limites padrão
        protegem a estabilidade do servidor. Visite também nossa{' '}
        <Link to="/faq" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          página completa de FAQ
        </Link>
        .
      </p>
    ),
  },
  {
    id: 'faq-8',
    question: '8. É possível analisar perfis privados do TikTok?',
    schemaAnswer:
      'Não. Apenas dados públicos visíveis ficam acessíveis. Se você souber os números manualmente, utilize nossa Calculadora de Engajamento TikTok ou Calculadora de CPM TikTok.',
    answer: (
      <p>
        <strong>Não.</strong> Somente dados públicos são acessíveis. Caso conheça os números de um perfil privado
        manualmente, teste-os na{' '}
        <Link
          to="/tiktok-engagement-calculator"
          className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800"
        >
          Calculadora de Engajamento TikTok
        </Link>{' '}
        ou na{' '}
        <Link
          to="/tiktok-cpm-calculator"
          className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800"
        >
          Calculadora de CPM TikTok
        </Link>
        .
      </p>
    ),
  },
  {
    id: 'faq-9',
    question: '9. Por que os dados de um perfil podem não estar disponíveis na busca?',
    schemaAnswer:
      'A busca pode falhar se o @ estiver digitado errado, tiver sido alterado recentemente, se a conta for privada/suspensa ou se o TikTok limitar requisições durante picos de tráfego.',
    answer: (
      <p>
        A consulta pode falhar por erro de digitação, mudança recente de nome, perfil privado ou suspenso ou limite
        temporário do TikTok em momentos de alto tráfego. Confirme o usuário e tente novamente em alguns segundos.
      </p>
    ),
  },
  {
    id: 'faq-10',
    question: '10. O que acontece quando as views de vídeos recentes não estão disponíveis?',
    schemaAnswer:
      'Se os totais principais carregarem mas faltarem os vídeos recentes, o KalkulatorTik ativa o modelo de fallback: estima views em 8% dos seguidores acima de 12.500 (10% entre 10.000 e 12.499, piso de 1.000 views abaixo) e calcula o engajamento por curtidas totais ou valores padrão.',
    answer: (
      <p>
        Quando os totais principais carregam sem os vídeos recentes, o KalkulatorTik usa o{' '}
        <strong>modelo de estimativa fallback</strong>: calcula <code>8%</code> dos seguidores a partir de{' '}
        <code>12.500+</code> (<code>10%</code> entre <code>10.000</code> e <code>12.499</code>, mínimo{' '}
        <code>1.000</code> abaixo) e estima engajamento a partir das curtidas e vídeos disponíveis.
      </p>
    ),
  },
  {
    id: 'faq-11',
    question: '11. O valor estimado de patrocínio é garantido?',
    schemaAnswer:
      'Não. Todos os valores são referências educacionais não vinculantes. Os valores reais dependem de acordos com marcas, nicho, público e negociação.',
    answer: (
      <p>
        <strong>Não.</strong> Todas as estimativas são referências educativas não vinculantes, não garantindo receita nem
        proposta oficial. Valores reais variam por marca, nicho, audiência e negociação.
      </p>
    ),
  },
  {
    id: 'faq-12',
    question: '12. Como criadores podem usar essa estimativa ao negociar com marcas?',
    schemaAnswer:
      'Use a média como base para um post orgânico patrocinado, cobre na faixa superior para Spark Ads, licenciamento ou exclusividade, e ofereça desconto moderado em pacotes com vários vídeos.',
    answer: (
      <div className="space-y-2">
        <p>
          Trate a média e a faixa como <strong>base inicial para um vídeo patrocinado orgânico padrão</strong>:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            Use a <strong>estimativa média</strong> para conferir propostas recebidas e evitar cobrar abaixo do justo.
          </li>
          <li>
            Cobre próximo ou acima do <strong>limite superior</strong> quando houver Spark Ads, licença de 30–90 dias,
            exclusividade ou produção complexa.
          </li>
          <li>
            Ofereça leve desconto rumo ao <strong>limite inferior</strong> ao fechar pacotes de 3 ou 5 vídeos.
          </li>
        </ul>
      </div>
    ),
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://www.kalkulatortik.com/#faq',
  inLanguage: 'pt',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.schemaAnswer },
  })),
};

const copy = {
  intro: {
    title: 'O Que É uma Calculadora de Dinheiro TikTok?',
    description:
      'Uma Calculadora de Dinheiro TikTok é uma ferramenta de avaliação para criadores que estima quanto um perfil público pode cobrar por um vídeo patrocinado—e ajuda marcas a comparar propostas.',
    p1: (
      <>
        Em vez de chutar quanto uma conta pode ganhar com marcas, esta{' '}
        <strong className="font-semibold text-slate-900">calculadora de dinheiro TikTok</strong> analisa sinais públicos
        visíveis&mdash;como <strong className="font-semibold text-slate-900">média de visualizações</strong>,{' '}
        <strong className="font-semibold text-slate-900">taxa de engajamento</strong>,{' '}
        <strong className="font-semibold text-slate-900">região do perfil</strong> e{' '}
        <strong className="font-semibold text-slate-900">escala de seguidores</strong>&mdash;para estimar um cachê por
        vídeo em USD e sua faixa de negociação.
      </>
    ),
    p2: 'Seja você criador montando seu mídia kit ou empresa comparando influenciadores antes da campanha, o KalkulatorTik entrega um parâmetro transparente com qualquer @ público sem exigir senha.',
  },
  howToUse: {
    title: 'Como Usar a Calculadora de Dinheiro TikTok',
    description:
      'Calcule a estimativa de patrocínio no TikTok por usuário em três passos rápidos e sem login.',
    actionLabel: 'Ir para a Calculadora Acima \u2191',
    steps: [
      {
        badge: 'PASSO 01',
        title: 'Digite o Usuário e Calcule',
        body: (
          <>
            Insira qualquer @ público acima (ex.: <code>khaby.lame</code> ou <code>@mrbeast</code>)&mdash;o{' '}
            <code>@</code> inicial sai automaticamente&mdash;e clique em <strong>Calcular Valor de Patrocínio</strong>.
          </>
        ),
      },
      {
        badge: 'PASSO 02',
        title: 'Revise o Perfil e a Fonte de Dados',
        body: (
          <>
            Veja no aviso superior se os números vieram de <strong>vídeos recentes ao vivo</strong> ou{' '}
            <strong>modo fallback</strong>, conferindo valor estimado, CPM e 6 indicadores.
          </>
        ),
      },
      {
        badge: 'PASSO 03',
        title: 'Aplique aos Termos do Contrato',
        body: (
          <>
            <strong>Criadores:</strong> Use a média como base orgânica antes de somar Spark Ads ou licenças.{' '}
            <strong>Marcas:</strong> Compare o cachê pedido com o alcance esperado.
          </>
        ),
      },
    ],
    troubleshootingTitle: 'Solução de Problemas e Atualização Manual de Cache',
    troubleshootingP1: (
      <>
        <strong className="text-slate-900">Consultas Públicas e Limites:</strong> Apenas contas públicas podem ser
        analisadas. Se houver limite temporário do TikTok, aguarde alguns segundos e tente de novo.
      </>
    ),
    troubleshootingP2: (
      <>
        <strong className="text-slate-900">Cache de 1 Hora e Dados Recentes:</strong> Os resultados ficam em cache por
        até 1 hora. Para puxar dados atualizados agora, use <strong>Refresh Data</strong> na{' '}
        <Link to="/calculator" className="font-semibold text-teal-700 underline underline-offset-2">
          Visualização Dedicada com Refresh
        </Link>
        .
      </>
    ),
    footerNote: 'Abaixo explicamos cada cartão de avaliação e as seis métricas públicas do Passo 02.',
  },
  results: {
    title: 'Desempenho do Perfil e Valor Estimado de Patrocínio',
    description:
      'Cada busca transforma dados públicos do perfil em um resumo de ganhos e referência comercial por vídeo patrocinado.',
    primaryEyebrow: 'Resultado Principal de Avaliação',
    usdBadge: 'Referência USD',
    primaryTitle: 'Valor Estimado de Patrocínio por Vídeo',
    primaryLead: (
      <>
        O valor principal representa o{' '}
        <strong className="font-semibold text-slate-900">cachê base estimado para um vídeo patrocinado</strong>,
        apoiado por duas referências:
      </>
    ),
    rangeTitle: 'Faixa Estimada de Patrocínio',
    rangeBody:
      'Menções curtas ou pacotes de vários vídeos costumam ficar perto do piso; nichos competitivos e entregas extras sobem para o teto.',
    cpmTitle: 'CPM de Referência do Modelo',
    cpmBody:
      'Valor bruto presumido por 1.000 visualizações após ajuste por faixa regional, engajamento e escala de seguidores.',
    cacheNote: 'Os valores refletem dados públicos obtidos na consulta (ou em cache por até 1 hora).',
    profileOverviewTitle: 'Resumo do Perfil Público',
    profileOverviewBadge: 'Sinais de Identidade',
    profileOverviewBody: (
      <>
        Exibe dados públicos disponíveis&mdash;nome, <code>@handle</code>, selo verificado, bio pública, código
        regional (quando visível), ID do TikTok e data de criação da conta.
      </>
    ),
    metricsTitle: 'Resumo da Conta e Métricas de Atividade',
    metricsBadge: '6 Indicadores Públicos',
    howToReadTitle: 'Como Interpretar os Resultados',
    howToReadBody: (
      <>
        Trate o resultado como base prática para negociação, nunca como preço fixo ou pagamento garantido.{' '}
        <strong className="text-slate-900">Criadores</strong> podem acrescentar taxas por direitos de uso ou
        exclusividade; <strong className="text-slate-900">marcas</strong> avaliam se a proposta condiz com o alcance e
        engajamento reais.
      </>
    ),
    limitationsBadge: 'Limitações da Estimativa',
    limitationsBody:
      'O resultado usa apenas dados públicos visíveis. Não lê estatísticas privadas do TikTok Studio, faixa etária do público ou retenção. Quando faltam vídeos recentes, entra o modelo fallback.',
  },
  calculation: {
    title: 'Como a Calculadora de Dinheiro TikTok Estima o Valor',
    description:
      'Em vez de notas opacas, o KalkulatorTik aplica um modelo passo a passo transparente para calcular o valor estimado por vídeo patrocinado.',
    eqBadge: 'Equação Central de Avaliação',
    eqTitle: 'A Fórmula Principal de Patrocínio',
    eqBody:
      'Baseada no Custo por Mil (CPM) a cada 1.000 views. O cálculo do CPM mínimo, médio e máximo ajustado gera a referência e sua faixa.',
    eqPart1: 'Média de Views \u00F7 1.000',
    eqPart2: 'CPM Ajustado',
    eqPart3: 'Valor Estimado por Vídeo',
    step1Title: 'Passo 1: Calculando Média de Views e Taxa de Engajamento',
    step1Desc: 'Ao buscar um perfil público, o sistema analisa até 30 vídeos recentes com contagem de views:',
    avgViewsTitle: 'Média de Views por Vídeo',
    avgViewsDesc: 'Calcula a média aritmética simples entre os vídeos públicos recentes (> 0 views):',
    avgViewsFormula: 'Média de Views = Soma das Views Recentes \u00F7 Vídeos Analisados',
    engTitle: 'Taxa de Engajamento',
    engDesc: 'Mede interações públicas totais em relação às visualizações da amostra:',
    engFormula: 'Engajamento (%) = ((Curtidas + Comentários + Compartilhamentos) \u00F7 Views) \u00D7 100',
    step2Title: 'Passo 2: Definindo a Faixa Base de CPM (Premissas)',
    step2Desc:
      'Conforme o código regional visível do perfil, atribuímos uma faixa base em USD (Tier 3 por padrão se faltar região):',
    tableCaption: 'Premissas internas de CPM base do KalkulatorTik (USD por 1.000 views).',
    thTier: 'Nível de Mercado',
    thCountries: 'Códigos Regionais',
    thMin: 'Base Mín.',
    thAvg: 'Base Méd.',
    thMax: 'Base Máx.',
    step2Note: (
      <>
        <strong>Nota Metodológica:</strong> Essas faixas são premissas internas de referência&mdash;não tarifas oficiais
        do TikTok nem garantias comerciais.
      </>
    ),
    step3Title: 'Passo 3: Multiplicadores de Engajamento e Escala de Seguidores',
    step3Desc: (
      <>
        Dois fatores ajustam o CPM base antes do limite final entre <strong>$7.00</strong> e <strong>$80.00</strong>{' '}
        por 1.000 views:
      </>
    ),
    engAdjTitle: (
      <>
        Ajuste de Engajamento (<code>0.90x&ndash;1.20x</code>)
      </>
    ),
    engAdjBody: (
      <>
        Escala linearmente de <code>0%</code> (<code>0.90x</code>) passando pelo ponto neutro <code>5.0%</code> (
        <code>1.00x</code>) até <code>1.20x</code> em <code>15%+</code>.
      </>
    ),
    engAdjBox1: '0% = 0.90x · 5.0% = 1.00x (Neutro)',
    engAdjBox2: '7.5% = 1.05x · 15%+ = 1.20x (Teto)',
    scaleTitle: (
      <>
        Escala de Seguidores (<code>1.00x&ndash;1.18x</code>)
      </>
    ),
    scaleSub: 'Apenas acréscimo positivo (criadores menores nunca são penalizados):',
    boundsTitle: (
      <>
        Piso e Teto do CPM (<code>$7.00&ndash;$80.00</code>)
      </>
    ),
    boundsBody: (
      <>
        Cada CPM (baixo, médio e alto) é multiplicado pelos fatores e limitado entre <code>$7.00</code> e{' '}
        <code>$80.00</code>.
      </>
    ),
    boundsBox: 'CPM Ajustado = Base × Eng × Escala (Limites $7–$80)',
    fallbackTitle: 'Estimativas Fallback Sem Vídeos Recentes Disponíveis',
    fallbackViews: (
      <>
        <strong className="text-slate-900">Média de Views Fallback:</strong> Estimada em <code>8%</code> dos seguidores
        para <code>12.500+</code>, <code>10%</code> entre <code>10.000</code> e <code>12.499</code>, com piso mínimo de{' '}
        <code>1.000</code> views abaixo.
      </>
    ),
    fallbackEng: (
      <>
        <strong className="text-slate-900">Engajamento Fallback:</strong> Obtido das curtidas totais, vídeos e
        seguidores (<code>1.0%–50.0%</code>), ou padrões por faixa caso faltem contagens.
      </>
    ),
    exampleBadge: 'Exemplo Hipotético do Modelo',
    exampleTitle: 'Exemplo Prático: Calculando a Referência de um Criador',
    exampleTag: 'Perfil de Exemplo',
    exRegionLabel: 'Região',
    exRegionVal: 'EUA (Tier 1)',
    exFollowersLabel: 'Seguidores',
    exFollowersSub: 'Escala = 1.08x',
    exViewsLabel: 'Média de Views',
    exViewsVal: '50.000 / vídeo',
    exViewsSub: '50,0 unidades',
    exEngLabel: 'Engajamento',
    exEngSub: 'Fator = 1.08x',
    exStep1: '1. Engajamento Normalizado:',
    exStep2: '2. Fator de Engajamento:',
    exStep3: '3. Multiplicador Combinado:',
    exStep4Label: '4. Faixa CPM Ajustado:',
    exStep4Min: 'Mín',
    exStep4Avg: 'Méd',
    exStep4Max: 'Máx',
    exStep4Tag: '$34.99 méd',
    exStep5Title: '5. Referência Final (50 × $34.99)',
    exPerVideo: 'por vídeo patrocinado',
    exRange: 'Faixa: $1,283.00 – $2,449.50',
    exFooterNote: 'Apenas exemplo ilustrativo; não avalia dados privados de audiência ou conversão.',
    transitionNote:
      'Como modela o investimento de anunciantes externos por vídeo, tem finalidade diferente dos pagamentos diretos do TikTok.',
  },
  channels: {
    title: 'Patrocínios de Marca vs. TikTok Creator Rewards: Qual a Diferença?',
    description:
      'Parcerias comerciais com marcas e o Programa oficial Creator Rewards vêm de pagadores diferentes com regras distintas.',
    leftBadge: 'Estimado por esta Calculadora',
    leftTitle: 'Como Funcionam Patrocínios de Marca',
    leftLead: (
      <>
        Acordo comercial direto em que uma empresa ou agência paga o criador para destacar um produto em{' '}
        <strong>vídeo patrocinado</strong>.
      </>
    ),
    leftItems: [
      ['Quem Paga', 'Marcas, empresas ou agências diretamente via nota fiscal ou transferência.'],
      ['Como o Preço Muda', 'Negociado por vídeo ou pacote conforme alcance, nicho, produção e licenças.'],
      ['Elegibilidade', 'Aberto a criadores de qualquer porte—inclusive nano-criadores abaixo de 10.000 seguidores.'],
    ],
    rightBadge: 'Programa Interno do App',
    rightTitle: 'Como Funciona o TikTok Creator Rewards',
    rightLead: 'Pagamentos diretos administrados pelo TikTok (substituto do Creator Fund) no saldo do aplicativo.',
    rightItems: [
      ['Quem Paga', 'O TikTok repassa valores diretamente a criadores inscritos conforme termos oficiais.'],
      [
        'Critérios',
        <>
          Exige <code>10.000+</code> seguidores, <code>100.000+</code> views em 30 dias, <code>18+</code> anos (
          <code>19+</code> na Coreia do Sul), conta regular e país elegível.
        </>,
      ],
      [
        'Regras de Repasse',
        <>
          Válido para vídeos originais de <code>1+ minuto</code> com <strong>views qualificadas</strong> e RPM dinâmico.
        </>,
      ],
      ['Outros Recursos', 'Presentes em LIVE e comissões do TikTok Shop possuem políticas separadas.'],
    ],
    compareTitle: 'Comparação Lado a Lado: Acordos de Marca vs. Monetização da Plataforma',
    tableCaption: 'Diferenças entre patrocínios comerciais e repasses do TikTok.',
    thFeature: 'Recurso',
    thSponsor: 'Patrocínios de Marca (Vídeos)',
    thRewards: 'TikTok Creator Rewards (App)',
    whyTitle: 'Por Que uma Estimativa de Patrocínio Não é um Pagamento do TikTok',
    whyBody:
      'As métricas privadas de Creator Rewards permanecem restritas ao TikTok Studio. Além disso, marcas remuneram criação personalizada e exposição de produto.',
    whyFootnote: 'Regras, países participantes e pagamentos do Creator Rewards pertencem unicamente ao TikTok.',
  },
  factors: {
    title: 'O Que Afeta os Valores de Patrocínio no TikTok?',
    description:
      'Contas com views parecidas podem negociar cachês distintos conforme nicho, entregáveis e direitos contratados.',
    measuredTitle: 'Medido Automaticamente na Fórmula',
    measuredBadge: '4 Sinais Públicos',
    measuredBody: (
      <>
        A ferramenta já pondera <strong>Média de Views</strong>, <strong>Engajamento</strong>, <strong>Região</strong> e{' '}
        <strong>Escala de Seguidores</strong> antes de ajustes comerciais.
      </>
    ),
    unmeasuredTitle: 'Fatores Reais de Negociação Não Medidos pela Calculadora',
    unmeasuredBadge: 'Negociado Privadamente',
    adjustTitle: 'Como Ajustar Seu Orçamento Conforme o Escopo',
    adjustBody: (
      <>
        Use a cifra calculada como <strong>base para um vídeo orgânico</strong>, adicionando itens extras para Spark
        Ads, licenciamento, exclusividade ou gravações elaboradas.
      </>
    ),
  },
  followersVsViews: {
    title: 'Seguidores vs. Visualizações: O Que Vale Mais em Patrocínios?',
    description:
      'O feed Para Você distribui vídeos por interesse e retenção. Assim, uma conta grande inativa e um perfil médio ativo entregam alcances opostos.',
    creatorATag: 'Criador Hipotético A · Conta Grande Inativa',
    creatorAPrice: '$143.68 / vídeo',
    creatorABody: (
      <>
        Reuniu <strong>500.000 seguidores</strong> em tendências antigas, mas hoje tem média de{' '}
        <strong>8.000 views</strong> e <code>1.20%</code> de engajamento (Tier 3).
      </>
    ),
    creatorBTag: 'Criador Hipotético B · Alto Alcance Ativo',
    creatorBPrice: '$2,163.85 / vídeo',
    creatorBBody: (
      <>
        Canal de nicho com <strong>50.000 seguidores</strong> que entrega <strong>65.000 views médias</strong> e{' '}
        <code>9.40%</code> de engajamento (Tier 1).
      </>
    ),
    labelFollowers: 'Seguidores',
    labelViews: 'Média de Views por Vídeo',
    compareTitle: 'Comparação: Muitos Seguidores vs. Views Consistentes',
    compareCaption: 'Comparação hipotética calculada com a fórmula KalkulatorTik.',
    thMetric: 'Métrica / Etapa',
    thCreatorA: 'Criador A (500K Seguidores)',
    thCreatorB: 'Criador B (50K Seguidores)',
    thWhy: 'Impacto',
    tier3Note:
      'Nota: Mesmo no mesmo mercado Tier 3 ($18.00 CPM base), as 65.000 views e 9,40% do Criador B rendem $1,298.70 por vídeo—9× mais que o Criador A.',
    stillMattersTitle: 'Quando o Número de Seguidores Ainda Ajuda',
    stillMattersList: [
      <>
        <strong>Percepção e Prova Social:</strong> Alguns anunciantes filtram inicialmente por patamares de seguidores.
      </>,
      <>
        <strong>Familiaridade com a Comunidade:</strong> Seguidores recorrentes confiam mais em indicações.
      </>,
      <>
        <strong>Recursos da Plataforma:</strong> Metas de seguidores liberam lives e ferramentas nativas.
      </>,
    ],
    rateCardTitle: 'Montando um Mídia Kit Equilibrado',
    rateCardBody: (
      <>
        Destaque <strong>média de visualizações recentes</strong>, <strong>engajamento</strong> e retenção no início do
        mídia kit. Seguidores mostram o passado; views recentes provam o alcance atual.
      </>
    ),
    rateCardPrompt: 'Pronto para testar seu perfil?',
    rateCardBtn: 'Verificar Seu Perfil \u2191',
  },
  relatedTools: {
    title: 'Explore Mais Calculadoras TikTok Grátis',
    description:
      'Combine sua estimativa de patrocínio com cálculos de custo de mídia CPM e auditorias manuais de engajamento.',
    tool1Tag: 'Auditoria de Interação',
    tool1Badge: 'Entrada Manual',
    tool1Title: 'Calculadora de Taxa de Engajamento TikTok',
    tool1Desc: (
      <>
        Calcula a média de curtidas por vídeo a partir de <strong>Total de Curtidas</strong>,{' '}
        <strong>Vídeos</strong> e <strong>Seguidores</strong> (aceita abreviações como <code>277.8K</code> ou{' '}
        <code>4.2M</code>) frente a médias de <code>1K&ndash;5K</code> a <code>1M+</code>.
      </>
    ),
    tool1Formula: '((Total de Curtidas ÷ Total de Seguidores) ÷ Total de Vídeos) × 100',
    tool1Best: 'Ideal para revisar saúde do canal, mídia kit e contas privadas.',
    tool1Cta: 'Abrir Calculadora de Engajamento \u2192',
    tool2Tag: 'Custos de Anúncio & Mídia',
    tool2Badge: '7 Moedas',
    tool2Title: 'Calculadora de CPM TikTok',
    tool2Desc: (
      <>
        Ferramenta em três modos com <code>USD</code>, <code>EUR</code>, <code>GBP</code>, <code>CAD</code>,{' '}
        <code>AUD</code>, <code>INR</code> e <code>PKR</code> para comparar orçamentos de anúncios pagos e cachês.
      </>
    ),
    tool2Modes: ['Calcular CPM', 'Calcular Investimento', 'Calcular Impressões'],
    tool2Best: 'Ideal para gestores de tráfego, agências e criadores avaliando ROI.',
    tool2Cta: 'Abrir Calculadora de CPM \u2192',
    refreshTag: 'Visualização com Refresh Separada',
    refreshBadge: 'Inclui Limpeza de Cache',
    refreshTitle: 'Busca de Perfil com Atualização Manual de Cache',
    refreshDesc: (
      <>
        Precisa buscar dados atualizados ignorando o cache de 1 hora? Acesse a página dedicada com botão manual{' '}
        <strong>Refresh Data</strong>.
      </>
    ),
    refreshCta: 'Abrir Visualização Cache-Refresh \u2192',
  },
  faq: {
    title: 'Perguntas Frequentes sobre Valores e Dinheiro no TikTok',
    description:
      'Respostas diretas sobre metodologia de patrocínio, privacidade de dados públicos, modo fallback e negociação.',
    ariaTogglePrefix: 'Abrir ou fechar resposta: ',
    disclaimer:
      'As respostas refletem a metodologia atual e práticas de marketing de influência, sem constituir aconselhamento financeiro, jurídico ou fiscal.',
    viewAllLink: 'Ver FAQ Completo de Monetização \u2192',
  },
  closing: {
    sectionAriaLabel: 'Iniciar cálculo de perfil TikTok ou explorar ferramentas relacionadas',
    title: 'Pronto para Estimar Seu Valor de Patrocínio no TikTok?',
    description:
      'Para definir seu mídia kit, conferir uma proposta comercial ou comparar CPM de campanhas, digite um perfil público acima ou abra outra calculadora.',
    btnPrimary: 'Calcular por Usuário do TikTok \u2191',
    btnCpm: 'Abrir Calculadora CPM',
    btnEng: 'Abrir Calculadora Engajamento',
    aboutLine: (
      <>
        O KalkulatorTik é uma plataforma independente de análise para criadores. Saiba mais em{' '}
        <Link to="/about" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Sobre o KalkulatorTik
        </Link>{' '}
        ou acesse o{' '}
        <Link to="/faq" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          FAQ de Monetização TikTok
        </Link>
        .
      </>
    ),
    legalNotice: (
      <>
        O KalkulatorTik é uma ferramenta independente e não é afiliado, endossado nem conectado oficialmente à TikTok Inc. ou ByteDance Ltd.; todas as marcas registradas pertencem aos respectivos proprietários. Os valores são estimativas informativas—leia nossa{' '}
        <Link to="/privacy" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Política de Privacidade
        </Link>{' '}
        e{' '}
        <Link to="/terms" className="font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800">
          Termos e Condições
        </Link>
        .
      </>
    ),
  },
};

export const PT_HOME_PACK = {
  seo,
  faqSchema,
  metricsGuide,
  cpmTiers,
  followerScaleTiers,
  channelRows,
  factors,
  creatorRows,
  faqItems,
  copy,
};
