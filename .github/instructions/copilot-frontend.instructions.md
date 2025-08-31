Crie uma instrução para orientar a tomada de decisão na criação do UI/UX do projeto.

Tecnologias que foram escolhidas:
- next js (framework principal)
- shadcn ui (UI kit)
- tailwind css library
- 

Na criação, caso não seja informado qual componente do shadcn ui utilizar, solicite ao usuário que informe qual componente deseja utilizar.

- typescript (linguagem principal)

Conceitos para considerar:
- Cada componente deve ser reutilizável e modular.
- O design deve ser responsivo e acessível.
- Utilize as classes do Tailwind CSS para estilização.
- Siga as diretrizes de design do Shadcn UI para garantir consistência visual.
- As interações devem ser intuitivas e amigáveis ao usuário.
- Utilize o TypeScript para garantir a tipagem e segurança do código.
- Cada componente deve ter documentação clara e exemplos de uso.
- Teste os componentes em diferentes dispositivos e tamanhos de tela para garantir a responsividade.
- Considere a performance e otimização do carregamento dos componentes.
- Utilize o sistema de temas do Tailwind CSS para permitir personalização visual.
- Utilize o sistema de ícones do Shadcn UI para manter a consistência visual.
- Utilize o sistema de tipografia do Tailwind CSS para garantir legibilidade e consistência.
- Utilize o sistema de espaçamento do Tailwind CSS para garantir consistência no layout.
- Utilize o sistema de cores do Tailwind CSS para garantir consistência visual.
- Utilize o sistema de animações do Shadcn UI para melhorar a experiência do usuário.
- Utilize o sistema de estados do Shadcn UI para garantir consistência nas interações.
- Utilize o sistema de validação do Shadcn UI para garantir a integridade dos dados.
- Utilize o sistema de acessibilidade do Shadcn UI para garantir que todos os usuários possam interagir com os componentes.
- Utilize o sistema de testes do Shadcn UI para garantir a qualidade dos componentes.
- Utilize o sistema de documentação do Shadcn UI para garantir que os componentes sejam fáceis de entender e usar.
- a documentação deve incluir exemplos de uso, propriedades, eventos e métodos disponíveis.
- Adicione tags de teste para utilização com ferramentas de teste automatizado. (playwright, vitest, etc.)

Separação de responsabilidades 

Frontend 
- Componentes de UI (Botões, Inputs, etc.)
- Lógica de apresentação (Estado, Efeitos, etc.)
- Estilização (Classes do Tailwind CSS, Temas, etc.)
- Serve components, client components

Backend
- API routes
- Lógica de negócios
- Integração com banco de dados

Padrões de projeto
- Componentização
- Reutilização de código
- Testes automatizados
- Types e interfaces devem ser criados na pasta types, independente do componente, serviço ou repositório que irá utilizar.
- Não crie código com comentários
- Utilize nomes descritivos para arquivos e pastas
- Mantenha a estrutura de pastas organizada e consistente
- Não crie código duplicado, tenha sempre o paradigma funcional em mente
- Utilize ferramentas de linting e formatação automática para manter a qualidade do código
- Priorize a legibilidade e clareza do código SEMPRE.
- Serviços que manipulam dados devem ser desacoplados da lógica de apresentação.
- Regra de negócio sempre deve ser localizada no service
- Lógica do componente deve ser que precisam de requisção devem ser feitas em um custom hook. exemplo, o fetch deve sempre ser feito em um custom hook.
- Componentes devem ser testáveis e ter cobertura de testes.
- Todo service deve ser acompanhado de testes automatizados. (vitest)
- Repositórios devem ser utilizar "import 'server-only'" para garantir que o código seja executado apenas no servidor e segredos não sejam expostos.
- Não crie código com comentários
- Para o frontend utilize playwright para testes automatizados.
- teste e2e com playwright sempre deve testar o caminho feliz.
- service sempre devem ser "use serve"
- 