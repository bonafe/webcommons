# EsqueletoSpring

## Sobre a aplicação
O EsqueletoSpring utiliza o framework de [Spring](https://spring.io/) para Java.  
Para o desenvolvimento rodamos o EsqueletoSpring localmente no Eclipse como um programa Java (é gerado um arquivo jar que sobe um servidor web local embutido).  
Para colocar em produção geramos um arquivo WAR e fazemos o deploy em um servidor Tomcat.  
O backend é todo exposto em uma API Rest e é consumido pelo frontend feito em HTML, CSS e Javascript.  
O projeto também utiliza o gerenciador de pacotes [Maven](https://maven.apache.org/) para Java.

## Primeiro acesso
Automaticamente o primeiro usuário a acessar o sistema recebe os perfis de administrador e cadastrador.
Cada usuário subsequente que entra no sistema tem um usuário equivalente criado no banco de dados com seu CPF (inicialmente não recebe nenhuma permissão especial).
TODO: Administrador poder adicionar usuários, configurações de acesso para usuários não cadastrados.

## Base de dados
### H2 com arquivo em disco
O projeto está configurado para usar uma base de dados H2 persistida em disco no arquivo.
Veja o arquivo ./src/main/resources/application.properties para mais configurações e referências.


## Perfis de Acesso
ROLE_ADMINISTRADOR
	Cria módulos e permissões do sistema
	
ROLE_CADASTRADOR
	Concede perfil a outros usuários
	

	