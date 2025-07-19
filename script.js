// Sistema de Carrinho de Compras
class CarrinhoCompras {
  constructor() {
    this.itens = [];
    this.total = 0;
    this.tipoEntrega = 'retirada';
    this.bairro = '';
    this.taxaEntrega = 0;
    this.observacoes = '';
    this.init();
  }

  init() {
    this.criarCarrinho();
    this.adicionarEventListeners();
    this.carregarCarrinho();
  }

  criarCarrinho() {
    // Criar o modal do carrinho (Etapa 1)
    const carrinhoHTML = `
      <div id="carrinho-modal" class="carrinho-modal">
        <div class="carrinho-content">
          <div class="carrinho-header">
            <h3>🛒 Seu Pedido</h3>
            <button class="fechar-carrinho" onclick="carrinho.fecharCarrinho()">×</button>
          </div>
          <div class="carrinho-itens" id="carrinho-itens">
            <!-- Itens serão inseridos aqui -->
          </div>
          <div class="carrinho-tipo-entrega">
            <h4>📦 Tipo de Entrega</h4>
            <div class="entrega-opcoes">
              <label>
                <input type="radio" name="tipo-entrega" value="retirada" checked onchange="carrinho.atualizarTipoEntrega('retirada')">
                Retirada no Local
              </label>
              <label>
                <input type="radio" name="tipo-entrega" value="entrega" onchange="carrinho.atualizarTipoEntrega('entrega')">
                Entrega
              </label>
            </div>
          </div>
          <div class="carrinho-footer">
            <div class="carrinho-botoes">
              <button class="btn-limpar" onclick="carrinho.limparCarrinho()">Limpar</button>
              <button class="btn-continuar" onclick="carrinho.continuarPedido()">Continuar</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', carrinhoHTML);

    // Criar modal de retirada (Etapa 2 - Retirada)
    const retiradaHTML = `
      <div id="retirada-modal" class="retirada-modal">
        <div class="retirada-content">
          <div class="retirada-header">
            <h3>🏪 Retirada no Local</h3>
            <button class="fechar-retirada" onclick="carrinho.fecharRetirada()">×</button>
          </div>
          <div class="retirada-body">
            <div class="dados-retirada">
              <h4>👤 Dados para Retirada</h4>
              <div class="campo">
                <label>Nome Completo:</label>
                <input type="text" id="nome-retirada-input" placeholder="Digite seu nome completo">
              </div>
              <div class="campo">
                <label>Telefone:</label>
                <input type="tel" id="telefone-retirada-input" placeholder="Digite seu telefone">
              </div>
            </div>
            <div class="observacoes-campo">
              <label>Observações:</label>
              <textarea id="retirada-observacoes-input" placeholder="Digite observações sobre o pedido"></textarea>
            </div>
          </div>
          <div class="retirada-footer">
            <button class="btn-voltar" onclick="carrinho.voltarCarrinho()">Voltar</button>
            <button class="btn-continuar" onclick="carrinho.continuarParaConfirmacao()">Continuar</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', retiradaHTML);

    // Criar modal de entrega (Etapa 2 - Entrega)
    const entregaHTML = `
      <div id="entrega-modal" class="entrega-modal">
        <div class="entrega-content">
          <div class="entrega-header">
            <h3>📍 Dados de Entrega</h3>
            <button class="fechar-entrega" onclick="carrinho.fecharEntrega()">×</button>
          </div>
          <div class="entrega-body">
            <div class="entrega-campos">
              <h4>📍 Dados de Entrega</h4>
              <div class="endereco-campos">
                <div class="campo">
                  <label>Cidade:</label>
                  <input type="text" value="São Paulo" readonly>
                </div>
                <div class="campo">
                  <label>Bairro:</label>
                  <select id="bairro-select" onchange="carrinho.atualizarBairro()">
                    <option value="">Selecione o bairro</option>
                    <option value="bairro1">Bairro 1 - Taxa R$ 2,00</option>
                    <option value="bairro2">Bairro 2 - Taxa R$ 5,00</option>
                  </select>
                </div>
                <div class="campo">
                  <label>Endereço:</label>
                  <input type="text" id="endereco-input" placeholder="Digite seu endereço completo">
                </div>
                <div class="campo">
                  <label>
                    <input type="checkbox" id="apartamento-check" onchange="carrinho.toggleApartamento()">
                    Apartamento
                  </label>
                </div>
                <div class="campo apartamento-campos" id="apartamento-campos" style="display: none;">
                  <div class="campo-row">
                    <div class="campo">
                      <label>Bloco:</label>
                      <input type="text" id="bloco-input" placeholder="Digite o bloco">
                    </div>
                    <div class="campo">
                      <label>Número do Apartamento:</label>
                      <input type="text" id="apartamento-input" placeholder="Digite o número">
                    </div>
                  </div>
                </div>
                <div class="campo">
                  <label>Nome Completo:</label>
                  <input type="text" id="nome-entrega-input" placeholder="Digite seu nome completo">
                </div>
                <div class="campo">
                  <label>Telefone:</label>
                  <input type="tel" id="telefone-input" placeholder="Digite seu telefone">
                </div>
              </div>
            </div>
            <div class="observacoes-campo">
              <label>Observações:</label>
              <textarea id="observacoes-input" placeholder="Digite observações sobre o pedido ou entrega"></textarea>
            </div>
          </div>
          <div class="entrega-footer">
            <button class="btn-voltar" onclick="carrinho.voltarCarrinho()">Voltar</button>
            <button class="btn-continuar" onclick="carrinho.continuarParaConfirmacao()">Continuar</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', entregaHTML);

    // Criar modal de confirmação (Etapa 3)
    const confirmacaoHTML = `
      <div id="confirmacao-modal" class="confirmacao-modal">
        <div class="confirmacao-content">
          <div class="confirmacao-header">
            <h3>✅ Confirmação do Pedido</h3>
            <button class="fechar-confirmacao" onclick="carrinho.fecharConfirmacao()">×</button>
          </div>
          <div class="confirmacao-body">
            <div class="confirmacao-resumo">
              <h4>📋 Resumo do Pedido</h4>
              <div id="confirmacao-resumo-itens"></div>
              <div class="confirmacao-total">
                <span>Subtotal: R$ <span id="confirmacao-subtotal">0,00</span></span>
                <span id="confirmacao-taxa" style="display: none;">Taxa de Entrega: R$ <span id="confirmacao-taxa-valor">0,00</span></span>
                <span class="total-final">Total: R$ <span id="confirmacao-total">0,00</span></span>
              </div>
            </div>
            <div class="confirmacao-dados">
              <h4>👤 Dados do Cliente</h4>
              <div id="confirmacao-dados-cliente"></div>
            </div>
            <div class="confirmacao-observacoes">
              <h4>📝 Observações</h4>
              <div id="confirmacao-observacoes-texto"></div>
            </div>
            <div class="confirmacao-pagamento">
              <h4>💳 Forma de Pagamento</h4>
              <div class="pagamento-opcoes">
                <div class="pagamento-opcao">
                  <input type="radio" id="pix" name="pagamento" value="pix" onchange="carrinho.selecionarPagamento()">
                  <label for="pix">PIX</label>
                </div>
                <div class="pagamento-opcao">
                  <input type="radio" id="dinheiro" name="pagamento" value="dinheiro" onchange="carrinho.selecionarPagamento()">
                  <label for="dinheiro">Dinheiro</label>
                </div>
                <div class="pagamento-opcao">
                  <input type="radio" id="cartao" name="pagamento" value="cartao" onchange="carrinho.selecionarPagamento()">
                  <label for="cartao">Cartão</label>
                </div>
              </div>
              
              <!-- Campos específicos para cada forma de pagamento -->
              <div id="pagamento-campos" class="pagamento-campos" style="display: none;">
                <!-- PIX -->
                <div id="pix-campos" class="pagamento-tipo-campos" style="display: none;">
                  <p>📱 PIX será enviado via WhatsApp após confirmação do pedido</p>
                </div>
                
                <!-- Dinheiro -->
                <div id="dinheiro-campos" class="pagamento-tipo-campos" style="display: none;">
                  <div class="total-info">
                    <p><strong>💰 Total do Pedido: R$ <span id="total-dinheiro">0,00</span></strong></p>
                  </div>
                  <div class="campo">
                    <label>Valor recebido:</label>
                    <input type="number" id="valor-recebido" placeholder="0,00" step="0.01" onchange="carrinho.calcularTroco()">
                  </div>
                  <div class="campo">
                    <label>
                      <input type="checkbox" id="precisa-troco" onchange="carrinho.toggleTroco()">
                      Precisa de troco?
                    </label>
                  </div>
                  <div id="troco-info" class="troco-info" style="display: none;">
                    <p>Troco: R$ <span id="valor-troco">0,00</span></p>
                  </div>
                </div>
                
                <!-- Cartão -->
                <div id="cartao-campos" class="pagamento-tipo-campos" style="display: none;">
                  <div class="campo">
                    <label>Tipo do Cartão:</label>
                    <select id="tipo-cartao" onchange="carrinho.atualizarBandeiras()">
                      <option value="">Selecione o tipo</option>
                      <option value="debito">Débito</option>
                      <option value="credito">Crédito</option>
                    </select>
                  </div>
                  <div class="campo">
                    <label>Bandeira:</label>
                    <select id="bandeira-cartao">
                      <option value="">Selecione a bandeira</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="confirmacao-footer">
            <button class="btn-voltar" onclick="carrinho.voltarParaDados()">Voltar</button>
            <button class="btn-enviar" onclick="carrinho.enviarPedido()" disabled>Enviar Pedido</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', confirmacaoHTML);

    // Criar modal de especificações da pizza
    const especificacoesHTML = `
      <div id="especificacoes-modal" class="especificacoes-modal">
        <div class="especificacoes-content">
          <div class="especificacoes-header">
            <h3 id="pizza-nome">Personalizar Pizza</h3>
            <button class="fechar-especificacoes" onclick="carrinho.fecharEspecificacoes()">×</button>
          </div>
          <div class="especificacoes-body">
            <div class="preco-base">
              <span>Preço Base: R$ <span id="preco-base">0,00</span></span>
            </div>
            <div class="adicionais">
              <h4>➕ Adicionais (R$ 5,00 cada)</h4>
              <div class="adicionais-opcoes">
                <label>
                  <input type="checkbox" value="queijo" onchange="carrinho.atualizarAdicionais()">
                  Queijo Extra
                </label>
                <label>
                  <input type="checkbox" value="tomate" onchange="carrinho.atualizarAdicionais()">
                  Tomate Extra
                </label>
              </div>
            </div>
            <div class="remover-ingredientes">
              <h4>➖ Remover Ingredientes</h4>
              <div class="remover-opcoes" id="remover-opcoes">
                <!-- Opções serão geradas dinamicamente -->
              </div>
            </div>
            <div class="especificacoes-total">
              <span>Total: R$ <span id="especificacoes-total">0,00</span></span>
            </div>
          </div>
          <div class="especificacoes-footer">
            <button class="btn-cancelar" onclick="carrinho.fecharEspecificacoes()">Cancelar</button>
            <button class="btn-adicionar-pizza" onclick="carrinho.adicionarPizzaEspecificada()">Adicionar ao Carrinho</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', especificacoesHTML);

    // Criar botão flutuante do carrinho
    const botaoCarrinhoHTML = `
      <div id="botao-carrinho" class="botao-carrinho">
        <span class="carrinho-icon">🛒</span>
        <span class="carrinho-contador" id="carrinho-contador">0</span>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', botaoCarrinhoHTML);
  }

  adicionarEventListeners() {
    // Adicionar botões "Adicionar" aos cards
    document.querySelectorAll('.pizza-card, .bebida-card').forEach(card => {
      const btnAdicionar = document.createElement('button');
      btnAdicionar.className = 'btn-adicionar';
      btnAdicionar.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Adicionar';
      btnAdicionar.onclick = (e) => {
        e.stopPropagation();
        this.adicionarItem(card);
      };
      card.appendChild(btnAdicionar);
    });

    // Event listener para o botão do carrinho
    const botaoCarrinho = document.getElementById('botao-carrinho');
    if (botaoCarrinho) {
      botaoCarrinho.addEventListener('click', () => {
        this.abrirCarrinho();
      });
    }

    // Fechar carrinho ao clicar fora
    const carrinhoModal = document.getElementById('carrinho-modal');
    if (carrinhoModal) {
      carrinhoModal.addEventListener('click', (e) => {
        if (e.target.id === 'carrinho-modal') {
          this.fecharCarrinho();
        }
      });
    }

    // Fechar especificações ao clicar fora
    const especificacoesModal = document.getElementById('especificacoes-modal');
    if (especificacoesModal) {
      especificacoesModal.addEventListener('click', (e) => {
        if (e.target.id === 'especificacoes-modal') {
          this.fecharEspecificacoes();
        }
      });
    }

    // Event listeners para campos de entrega
    const observacoesInput = document.getElementById('observacoes-input');
    if (observacoesInput) {
      observacoesInput.addEventListener('input', (e) => {
        this.observacoes = e.target.value;
      });
    }

    // Event listener direto para o botão enviar
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-enviar')) {
        e.preventDefault();
        e.stopPropagation();
        this.enviarPedido();
      }
    });

    // Event listener direto para o botão continuar do modal de entrega
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-continuar') && e.target.closest('#entrega-modal')) {
        e.preventDefault();
        e.stopPropagation();
        this.continuarParaConfirmacao();
      }
    });

    // Event listener direto para o botão continuar do modal de retirada
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-continuar') && e.target.closest('#retirada-modal')) {
        e.preventDefault();
        e.stopPropagation();
        this.continuarParaConfirmacao();
      }
    });

    // Event listeners para validação de campos
    this.adicionarEventListenersValidacao();
  }

  adicionarEventListenersValidacao() {
    // Campos de entrega
    const camposEntrega = [
      'bairro-select',
      'endereco-input',
      'telefone-input',
      'nome-entrega-input',
      'bloco-input',
      'apartamento-input'
    ];

    camposEntrega.forEach(campoId => {
      const campo = document.getElementById(campoId);
      if (campo) {
        campo.addEventListener('input', () => this.validarCamposEntrega());
        campo.addEventListener('change', () => this.validarCamposEntrega());
      }
    });

    // Campos de retirada
    const camposRetirada = [
      'nome-retirada-input',
      'telefone-retirada-input'
    ];

    camposRetirada.forEach(campoId => {
      const campo = document.getElementById(campoId);
      if (campo) {
        campo.addEventListener('input', () => this.validarCamposRetirada());
        campo.addEventListener('change', () => this.validarCamposRetirada());
      }
    });
  }

  adicionarItem(card) {
    const nome = card.querySelector('h3').textContent;
    const preco = parseFloat(card.querySelector('.preco').textContent.replace('R$ ', '').replace(',', '.'));
    const descricao = card.querySelector('p').textContent;

    // Verificar se é uma pizza
    if (card.classList.contains('pizza-card')) {
      this.abrirEspecificacoes(card);
    } else {
      // Para bebidas, adicionar diretamente
      this.adicionarItemDireto(nome, preco, descricao);
    }
  }

  adicionarItemDireto(nome, preco, descricao, especificacoes = null) {
    // Verificar se o item já existe no carrinho
    const itemExistente = this.itens.find(item => 
      item.nome === nome && 
      JSON.stringify(item.especificacoes) === JSON.stringify(especificacoes)
    );
    
    if (itemExistente) {
      itemExistente.quantidade++;
    } else {
      this.itens.push({
        nome: nome,
        preco: preco,
        descricao: descricao,
        quantidade: 1,
        especificacoes: especificacoes
      });
    }

    this.atualizarCarrinho();
    this.salvarCarrinho();
    this.mostrarNotificacao(`${nome} adicionado ao carrinho!`);
  }

  removerItem(index) {
    this.itens.splice(index, 1);
    this.atualizarCarrinho();
    this.salvarCarrinho();
  }

  alterarQuantidade(index, delta) {
    this.itens[index].quantidade += delta;
    
    if (this.itens[index].quantidade <= 0) {
      this.removerItem(index);
    } else {
      this.atualizarCarrinho();
      this.salvarCarrinho();
    }
  }

  atualizarCarrinho() {
    const containerItens = document.getElementById('carrinho-itens');
    const contador = document.getElementById('carrinho-contador');

    // Atualizar contador
    const totalItens = this.itens.reduce((total, item) => total + item.quantidade, 0);
    contador.textContent = totalItens;

    // Atualizar lista de itens
    containerItens.innerHTML = '';
    
    if (this.itens.length === 0) {
      containerItens.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio</p>';
    } else {
      this.itens.forEach((item, index) => {
        let especificacoesText = '';
        if (item.especificacoes) {
          if (item.especificacoes.adicionais && item.especificacoes.adicionais.length > 0) {
            especificacoesText += `<br><small>➕ ${item.especificacoes.adicionais.join(', ')}</small>`;
          }
          if (item.especificacoes.removidos && item.especificacoes.removidos.length > 0) {
            especificacoesText += `<br><small>➖ Sem: ${item.especificacoes.removidos.join(', ')}</small>`;
          }
        }

        const itemHTML = `
          <div class="carrinho-item">
            <div class="item-info">
              <h4>${item.nome}</h4>
              <p>${item.descricao}${especificacoesText}</p>
              <span class="item-preco">R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="item-controles">
              <button onclick="carrinho.alterarQuantidade(${index}, -1)">-</button>
              <span>${item.quantidade}</span>
              <button onclick="carrinho.alterarQuantidade(${index}, 1)">+</button>
              <button class="btn-remover" onclick="carrinho.removerItem(${index})">🗑️</button>
            </div>
          </div>
        `;
        containerItens.innerHTML += itemHTML;
      });
    }

    // Calcular total (mantido para uso interno)
    this.total = this.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  }

  limparCarrinho() {
    this.itens = [];
    this.atualizarCarrinho();
    this.salvarCarrinho();
  }

  abrirCarrinho() {
    document.getElementById('carrinho-modal').style.display = 'flex';
  }

  fecharCarrinho() {
    document.getElementById('carrinho-modal').style.display = 'none';
  }

  salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(this.itens));
  }

  carregarCarrinho() {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
      this.itens = JSON.parse(carrinhoSalvo);
      this.atualizarCarrinho();
    }
  }

  mostrarNotificacao(mensagem) {
    const notificacao = document.createElement('div');
    notificacao.className = 'notificacao';
    notificacao.textContent = mensagem;
    document.body.appendChild(notificacao);

    setTimeout(() => {
      notificacao.classList.add('show');
    }, 100);

    setTimeout(() => {
      notificacao.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notificacao);
      }, 300);
    }, 2000);
  }

  // Métodos para especificações da pizza
  abrirEspecificacoes(card) {
    const nome = card.querySelector('h3').textContent;
    const preco = parseFloat(card.querySelector('.preco').textContent.replace('R$ ', '').replace(',', '.'));
    const descricao = card.querySelector('p').textContent;

    // Armazenar dados da pizza atual
    this.pizzaAtual = { nome, preco, descricao, card };
    this.especificacoesAtuais = {
      adicionais: [],
      removidos: [],
      precoAdicional: 0
    };

    // Configurar modal
    document.getElementById('pizza-nome').textContent = nome;
    document.getElementById('preco-base').textContent = preco.toFixed(2).replace('.', ',');
    this.atualizarEspecificacoesTotal();

    // Gerar opções de remoção baseadas na descrição
    this.gerarOpcoesRemocao(descricao);

    // Mostrar modal
    document.getElementById('especificacoes-modal').style.display = 'flex';
  }

  gerarOpcoesRemocao(descricao) {
    const ingredientes = descricao.split(', ');
    const container = document.getElementById('remover-opcoes');
    container.innerHTML = '';

    ingredientes.forEach(ingrediente => {
      const label = document.createElement('label');
      label.innerHTML = `
        <input type="checkbox" value="${ingrediente.trim()}" onchange="carrinho.atualizarRemocao()">
        ${ingrediente.trim()}
      `;
      container.appendChild(label);
    });
  }

  atualizarAdicionais() {
    const checkboxes = document.querySelectorAll('.adicionais-opcoes input[type="checkbox"]:checked');
    this.especificacoesAtuais.adicionais = Array.from(checkboxes).map(cb => cb.value);
    this.especificacoesAtuais.precoAdicional = this.especificacoesAtuais.adicionais.length * 5;
    this.atualizarEspecificacoesTotal();
  }

  atualizarRemocao() {
    const checkboxes = document.querySelectorAll('.remover-opcoes input[type="checkbox"]:checked');
    this.especificacoesAtuais.removidos = Array.from(checkboxes).map(cb => cb.value);
    this.atualizarEspecificacoesTotal();
  }

  atualizarEspecificacoesTotal() {
    const precoBase = this.pizzaAtual.preco;
    const precoAdicional = this.especificacoesAtuais.precoAdicional;
    const total = precoBase + precoAdicional;
    
    document.getElementById('especificacoes-total').textContent = total.toFixed(2).replace('.', ',');
  }

  adicionarPizzaEspecificada() {
    const precoFinal = this.pizzaAtual.preco + this.especificacoesAtuais.precoAdicional;
    this.adicionarItemDireto(
      this.pizzaAtual.nome, 
      precoFinal, 
      this.pizzaAtual.descricao, 
      this.especificacoesAtuais
    );
    this.fecharEspecificacoes();
  }

  fecharEspecificacoes() {
    document.getElementById('especificacoes-modal').style.display = 'none';
    // Limpar checkboxes
    document.querySelectorAll('.adicionais-opcoes input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('.remover-opcoes input[type="checkbox"]').forEach(cb => cb.checked = false);
  }

  // Métodos para fluxo em etapas
  continuarPedido() {
    if (this.itens.length === 0) {
      this.mostrarNotificacao('Adicione itens ao carrinho primeiro!');
      return;
    }

    // Sempre abrir segundo estágio
    if (this.tipoEntrega === 'retirada') {
      this.abrirRetirada();
    } else {
      this.abrirEntrega();
    }
  }

  abrirRetirada() {
    this.atualizarResumoRetirada();
    const retiradaModal = document.getElementById('retirada-modal');
    const carrinhoModal = document.getElementById('carrinho-modal');
    
    if (retiradaModal && carrinhoModal) {
      retiradaModal.style.display = 'flex';
      carrinhoModal.style.display = 'none';
      
      // Inicializar validação
      setTimeout(() => this.validarCamposRetirada(), 100);
    }
  }

  fecharRetirada() {
    document.getElementById('retirada-modal').style.display = 'none';
    document.getElementById('carrinho-modal').style.display = 'flex';
  }

  abrirEntrega() {
    try {
      
      this.atualizarResumoEntrega();
      const entregaModal = document.getElementById('entrega-modal');
      const carrinhoModal = document.getElementById('carrinho-modal');
      
      if (entregaModal && carrinhoModal) {
        entregaModal.style.display = 'flex';
        carrinhoModal.style.display = 'none';
        
        // Inicializar validação após um delay
        setTimeout(() => {
          this.validarCamposEntrega();
        }, 200);
              } else {
          // Modais não encontrados
        }
      
          } catch (error) {
        // Tratamento de erro silencioso
      }
  }

  fecharEntrega() {
    document.getElementById('entrega-modal').style.display = 'none';
    document.getElementById('carrinho-modal').style.display = 'flex';
  }

  voltarCarrinho() {
    document.getElementById('retirada-modal').style.display = 'none';
    document.getElementById('entrega-modal').style.display = 'none';
    document.getElementById('carrinho-modal').style.display = 'flex';
  }

  atualizarResumoRetirada() {
    const container = document.getElementById('retirada-resumo-itens');
    const totalElement = document.getElementById('retirada-total');

    if (!container || !totalElement) {
      return;
    }

    // Mostrar itens
    container.innerHTML = '';
    this.itens.forEach(item => {
      let especificacoesText = '';
      if (item.especificacoes) {
        if (item.especificacoes.adicionais && item.especificacoes.adicionais.length > 0) {
          especificacoesText += `<br><small>➕ ${item.especificacoes.adicionais.join(', ')}</small>`;
        }
        if (item.especificacoes.removidos && item.especificacoes.removidos.length > 0) {
          especificacoesText += `<br><small>➖ Sem: ${item.especificacoes.removidos.join(', ')}</small>`;
        }
      }

      const itemHTML = `
        <div class="resumo-item">
          <div class="resumo-item-info">
            <span class="resumo-item-nome">${item.quantidade}x ${item.nome}</span>
            <small class="resumo-item-desc">${item.descricao}${especificacoesText}</small>
          </div>
          <span class="resumo-item-preco">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>
        </div>
      `;
      container.innerHTML += itemHTML;
    });

    // Calcular total
    const total = this.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    totalElement.textContent = total.toFixed(2).replace('.', ',');
  }

  atualizarResumoEntrega() {
    try {
      const container = document.getElementById('entrega-resumo-itens');
      const subtotalElement = document.getElementById('entrega-subtotal');
      const taxaElement = document.getElementById('entrega-taxa');
      const totalElement = document.getElementById('entrega-total');

      // Verificar se os elementos existem
      if (!container || !subtotalElement || !taxaElement || !totalElement) {
        return;
      }

      // Mostrar itens
      container.innerHTML = '';
      this.itens.forEach(item => {
        let especificacoesText = '';
        if (item.especificacoes) {
          if (item.especificacoes.adicionais && item.especificacoes.adicionais.length > 0) {
            especificacoesText += `<br><small>➕ ${item.especificacoes.adicionais.join(', ')}</small>`;
          }
          if (item.especificacoes.removidos && item.especificacoes.removidos.length > 0) {
            especificacoesText += `<br><small>➖ Sem: ${item.especificacoes.removidos.join(', ')}</small>`;
          }
        }

        const itemHTML = `
          <div class="resumo-item">
            <div class="resumo-item-info">
              <span class="resumo-item-nome">${item.quantidade}x ${item.nome}</span>
              <small class="resumo-item-desc">${item.descricao}${especificacoesText}</small>
            </div>
            <span class="resumo-item-preco">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>
          </div>
        `;
        container.innerHTML += itemHTML;
      });

      // Calcular valores
      const subtotal = this.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
      subtotalElement.textContent = subtotal.toFixed(2).replace('.', ',');
      taxaElement.textContent = this.taxaEntrega.toFixed(2).replace('.', ',');
      totalElement.textContent = (subtotal + this.taxaEntrega).toFixed(2).replace('.', ',');
      
          } catch (error) {
        // Tratamento de erro silencioso
      }
  }

  // Métodos para entrega
  atualizarTipoEntrega(tipo) {
    this.tipoEntrega = tipo;
  }

  atualizarBairro() {
    const select = document.getElementById('bairro-select');
    this.bairro = select.value;
    
    if (this.bairro === 'bairro1') {
      this.taxaEntrega = 2.00;
    } else if (this.bairro === 'bairro2') {
      this.taxaEntrega = 5.00;
    } else {
      this.taxaEntrega = 0;
    }
    
    // Atualizar resumo de entrega se estiver visível
    if (document.getElementById('entrega-modal').style.display === 'flex') {
      this.atualizarResumoEntrega();
    }
  }

  toggleApartamento() {
    const checkbox = document.getElementById('apartamento-check');
    const camposApartamento = document.getElementById('apartamento-campos');
    
    if (checkbox.checked) {
      camposApartamento.style.display = 'block';
    } else {
      camposApartamento.style.display = 'none';
      // Limpar campos quando desmarcar
      document.getElementById('bloco-input').value = '';
      document.getElementById('apartamento-input').value = '';
    }
    
    // Validar campos após mudança
    this.validarCamposEntrega();
  }

  validarCamposEntrega() {
    try {
      const bairro = document.getElementById('bairro-select')?.value || '';
      const endereco = document.getElementById('endereco-input')?.value || '';
      const telefone = document.getElementById('telefone-input')?.value || '';
      const nome = document.getElementById('nome-entrega-input')?.value || '';
      const isApartamento = document.getElementById('apartamento-check')?.checked || false;
      const bloco = document.getElementById('bloco-input')?.value || '';
      const apartamento = document.getElementById('apartamento-input')?.value || '';
      
      let camposValidos = bairro && endereco && telefone && nome;
      
      // Se for apartamento, validar também bloco e número
      if (isApartamento) {
        camposValidos = camposValidos && bloco && apartamento;
      }
      
      const btnContinuar = document.querySelector('#entrega-modal .btn-continuar');
      
      if (btnContinuar) {
        btnContinuar.disabled = !camposValidos;
        btnContinuar.style.opacity = camposValidos ? '1' : '0.5';
        btnContinuar.style.cursor = camposValidos ? 'pointer' : 'not-allowed';
              } else {
          // Botão não encontrado
        }
      
          } catch (error) {
        // Tratamento de erro silencioso
      }
  }

  validarCamposRetirada() {
    const nome = document.getElementById('nome-retirada-input').value;
    const telefone = document.getElementById('telefone-retirada-input').value;
    
    const camposValidos = nome && telefone;
    
    const btnContinuar = document.querySelector('#retirada-modal .btn-continuar');
    if (btnContinuar) {
      btnContinuar.disabled = !camposValidos;
      btnContinuar.style.opacity = camposValidos ? '1' : '0.5';
      btnContinuar.style.cursor = camposValidos ? 'pointer' : 'not-allowed';
    }
  }

  continuarParaConfirmacao() {
    try {
      
      if (this.tipoEntrega === 'entrega') {
        this.abrirConfirmacao();
      } else {
        this.abrirConfirmacao();
      }
      
          } catch (error) {
        // Tratamento de erro silencioso
      }
  }

  abrirConfirmacao() {
    this.atualizarResumoConfirmacao();
    const confirmacaoModal = document.getElementById('confirmacao-modal');
    const entregaModal = document.getElementById('entrega-modal');
    const retiradaModal = document.getElementById('retirada-modal');
    
    if (confirmacaoModal) {
      confirmacaoModal.style.display = 'flex';
      if (entregaModal) entregaModal.style.display = 'none';
      if (retiradaModal) retiradaModal.style.display = 'none';
      

    }
  }

  fecharConfirmacao() {
    document.getElementById('confirmacao-modal').style.display = 'none';
    document.getElementById('carrinho-modal').style.display = 'flex';
  }

  voltarParaDados() {
    document.getElementById('confirmacao-modal').style.display = 'none';
    
    if (this.tipoEntrega === 'entrega') {
      document.getElementById('entrega-modal').style.display = 'flex';
    } else {
      document.getElementById('retirada-modal').style.display = 'flex';
    }
  }

  atualizarResumoConfirmacao() {
    try {
      const container = document.getElementById('confirmacao-resumo-itens');
      const subtotalElement = document.getElementById('confirmacao-subtotal');
      const taxaElement = document.getElementById('confirmacao-taxa');
      const taxaValorElement = document.getElementById('confirmacao-taxa-valor');
      const totalElement = document.getElementById('confirmacao-total');
      const dadosClienteElement = document.getElementById('confirmacao-dados-cliente');
      const observacoesElement = document.getElementById('confirmacao-observacoes-texto');

      // Mostrar itens
      container.innerHTML = '';
      this.itens.forEach(item => {
        let especificacoesText = '';
        if (item.especificacoes) {
          if (item.especificacoes.adicionais && item.especificacoes.adicionais.length > 0) {
            especificacoesText += `<br><small>➕ ${item.especificacoes.adicionais.join(', ')}</small>`;
          }
          if (item.especificacoes.removidos && item.especificacoes.removidos.length > 0) {
            especificacoesText += `<br><small>➖ Sem: ${item.especificacoes.removidos.join(', ')}</small>`;
          }
        }

        const itemHTML = `
          <div class="resumo-item">
            <div class="resumo-item-info">
              <span class="resumo-item-nome">${item.quantidade}x ${item.nome}</span>
              <small class="resumo-item-desc">${item.descricao}${especificacoesText}</small>
            </div>
            <span class="resumo-item-preco">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>
          </div>
        `;
        container.innerHTML += itemHTML;
      });

      // Calcular valores
      const subtotal = this.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
      subtotalElement.textContent = subtotal.toFixed(2).replace('.', ',');
      
      if (this.tipoEntrega === 'entrega' && this.taxaEntrega > 0) {
        taxaElement.style.display = 'block';
        taxaValorElement.textContent = this.taxaEntrega.toFixed(2).replace('.', ',');
        totalElement.textContent = (subtotal + this.taxaEntrega).toFixed(2).replace('.', ',');
      } else {
        taxaElement.style.display = 'none';
        totalElement.textContent = subtotal.toFixed(2).replace('.', ',');
      }

      // Mostrar dados do cliente
      if (this.tipoEntrega === 'entrega') {
        const nome = document.getElementById('nome-entrega-input')?.value || '';
        const telefone = document.getElementById('telefone-input')?.value || '';
        const endereco = document.getElementById('endereco-input')?.value || '';
        const bairroText = this.bairro === 'bairro1' ? 'Bairro 1' : 'Bairro 2';
        const isApartamento = document.getElementById('apartamento-check')?.checked || false;
        const bloco = document.getElementById('bloco-input')?.value || '';
        const apartamento = document.getElementById('apartamento-input')?.value || '';
        
        let dadosHTML = `
          <div class="dados-cliente-item">
            <strong>👤 Nome:</strong> ${nome}
          </div>
          <div class="dados-cliente-item">
            <strong>📞 Telefone:</strong> ${telefone}
          </div>
          <div class="dados-cliente-item">
            <strong>🏙️ Cidade:</strong> São Paulo
          </div>
          <div class="dados-cliente-item">
            <strong>🏘️ Bairro:</strong> ${bairroText}
          </div>
          <div class="dados-cliente-item">
            <strong>🏠 Endereço:</strong> ${endereco}
          </div>
        `;
        
        if (isApartamento && bloco && apartamento) {
          dadosHTML += `
            <div class="dados-cliente-item">
              <strong>🏢 Bloco:</strong> ${bloco}
            </div>
            <div class="dados-cliente-item">
              <strong>🏠 Apartamento:</strong> ${apartamento}
            </div>
          `;
        }
        
        dadosClienteElement.innerHTML = dadosHTML;
      } else {
        const nome = document.getElementById('nome-retirada-input')?.value || '';
        const telefone = document.getElementById('telefone-retirada-input')?.value || '';
        
        dadosClienteElement.innerHTML = `
          <div class="dados-cliente-item">
            <strong>👤 Nome:</strong> ${nome}
          </div>
          <div class="dados-cliente-item">
            <strong>📞 Telefone:</strong> ${telefone}
          </div>
          <div class="dados-cliente-item">
            <strong>🏪 Tipo:</strong> Retirada no Local
          </div>
        `;
      }

      // Mostrar observações
      let observacoes = '';
      if (this.tipoEntrega === 'entrega') {
        observacoes = document.getElementById('observacoes-input')?.value || '';
      } else {
        observacoes = document.getElementById('retirada-observacoes-input')?.value || '';
      }
      
      if (observacoes.trim()) {
        observacoesElement.innerHTML = `<p>${observacoes}</p>`;
      } else {
        observacoesElement.innerHTML = '<p><em>Nenhuma observação</em></p>';
      }

      // Validar forma de pagamento após um pequeno delay
      setTimeout(() => {
        this.validarPagamento();
      }, 200);
      
          } catch (error) {
        // Tratamento de erro silencioso
      }
  }

  selecionarPagamento() {
    try {
      const pagamentoSelecionado = document.querySelector('input[name="pagamento"]:checked');
      const pagamentoCampos = document.getElementById('pagamento-campos');
      const pixCampos = document.getElementById('pix-campos');
      const dinheiroCampos = document.getElementById('dinheiro-campos');
      const cartaoCampos = document.getElementById('cartao-campos');

      if (pagamentoSelecionado) {
        pagamentoCampos.style.display = 'block';
        
        // Esconder todos os campos específicos
        pixCampos.style.display = 'none';
        dinheiroCampos.style.display = 'none';
        cartaoCampos.style.display = 'none';

        // Mostrar campos específicos da forma selecionada
        switch (pagamentoSelecionado.value) {
          case 'pix':
            pixCampos.style.display = 'block';
            break;
          case 'dinheiro':
            dinheiroCampos.style.display = 'block';
            // Atualizar o total para dinheiro
            this.atualizarTotalDinheiro();
            break;
          case 'cartao':
            cartaoCampos.style.display = 'block';
            break;
        }
      } else {
        pagamentoCampos.style.display = 'none';
      }

      // Aguardar um pouco para garantir que os campos foram atualizados
      setTimeout(() => {
        this.validarPagamento();
      }, 100);
      
          } catch (error) {
        // Tratamento de erro silencioso
      }
  }

  calcularTroco() {
    const valorRecebido = parseFloat(document.getElementById('valor-recebido').value) || 0;
    const total = this.calcularTotal();
    const troco = valorRecebido - total;
    
    const trocoInfo = document.getElementById('troco-info');
    const valorTroco = document.getElementById('valor-troco');
    
    if (troco > 0) {
      valorTroco.textContent = troco.toFixed(2).replace('.', ',');
      trocoInfo.style.display = 'block';
    } else {
      trocoInfo.style.display = 'none';
    }
    
    // Atualizar o total também
    this.atualizarTotalDinheiro();
  }

  toggleTroco() {
    const precisaTroco = document.getElementById('precisa-troco').checked;
    const valorRecebido = document.getElementById('valor-recebido');
    
    if (!precisaTroco) {
      valorRecebido.value = '';
      document.getElementById('troco-info').style.display = 'none';
    }
    
    this.validarPagamento();
  }

  atualizarBandeiras() {
    const tipoCartao = document.getElementById('tipo-cartao').value;
    const bandeiraSelect = document.getElementById('bandeira-cartao');
    
    // Limpar opções atuais
    bandeiraSelect.innerHTML = '<option value="">Selecione a bandeira</option>';
    
    if (tipoCartao) {
      const bandeiras = [
        'Visa',
        'Mastercard',
        'Elo',
        'Hipercard',
        'American Express',
        'Discover',
        'JCB'
      ];
      
      bandeiras.forEach(bandeira => {
        const option = document.createElement('option');
        option.value = bandeira.toLowerCase();
        option.textContent = bandeira;
        bandeiraSelect.appendChild(option);
      });
    }
    
    this.validarPagamento();
  }

  validarPagamento() {
    try {
      const pagamentoSelecionado = document.querySelector('input[name="pagamento"]:checked');
      const btnEnviar = document.querySelector('#confirmacao-modal .btn-enviar');
      
      if (!btnEnviar) {
        return;
      }
      
      if (!pagamentoSelecionado) {
        btnEnviar.disabled = true;
        btnEnviar.style.opacity = '0.5';
        btnEnviar.style.cursor = 'not-allowed';
        return;
      }

      let camposValidos = true;

      switch (pagamentoSelecionado.value) {
        case 'dinheiro':
          const precisaTroco = document.getElementById('precisa-troco')?.checked || false;
          if (precisaTroco) {
            const valorRecebido = document.getElementById('valor-recebido')?.value || '';
            camposValidos = valorRecebido && parseFloat(valorRecebido) > 0;
          }
          break;
        case 'cartao':
          const tipoCartao = document.getElementById('tipo-cartao')?.value || '';
          const bandeiraCartao = document.getElementById('bandeira-cartao')?.value || '';
          camposValidos = tipoCartao && bandeiraCartao;
          break;
        case 'pix':
          // PIX não precisa de campos adicionais
          camposValidos = true;
          break;
        default:
          camposValidos = false;
          break;
      }

      btnEnviar.disabled = !camposValidos;
      btnEnviar.style.opacity = camposValidos ? '1' : '0.5';
      btnEnviar.style.cursor = camposValidos ? 'pointer' : 'not-allowed';
      
          } catch (error) {
        // Tratamento de erro silencioso
      }
  }

  calcularTotal() {
    const subtotal = this.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    return this.tipoEntrega === 'entrega' ? subtotal + this.taxaEntrega : subtotal;
  }

  atualizarTotalDinheiro() {
    const totalDinheiro = document.getElementById('total-dinheiro');
    if (totalDinheiro) {
      const total = this.calcularTotal();
      totalDinheiro.textContent = total.toFixed(2).replace('.', ',');
    }
  }

  

  enviarPedido() {
    try {
      if (this.itens.length === 0) {
        this.mostrarNotificacao('Adicione itens ao carrinho primeiro!');
        return;
      }

      // Capturar observações baseado no tipo de entrega
      if (this.tipoEntrega === 'retirada') {
        this.observacoes = document.getElementById('retirada-observacoes-input')?.value || '';
      } else {
        this.observacoes = document.getElementById('observacoes-input')?.value || '';
      }

      const numeroWhatsApp = '5511999999999'; // Substitua pelo número correto da pizzaria
      const mensagem = this.criarMensagemPedido();
      
      // Verificar se a mensagem foi criada corretamente
      if (!mensagem || mensagem.trim() === '') {
        this.mostrarNotificacao('Erro ao criar mensagem do pedido!');
        return;
      }

      const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      
      // Abrir WhatsApp em nova aba
      const novaAba = window.open(urlWhatsApp, '_blank');
      
      if (!novaAba) {
        // Se não conseguiu abrir nova aba, tentar abrir na mesma aba
        window.location.href = urlWhatsApp;
      }
      
      // Mostrar notificação de sucesso
      this.mostrarNotificacao('Pedido enviado com sucesso!');
      
      // Fechar modal de confirmação
      this.fecharConfirmacao();
      
    } catch (error) {
      this.mostrarNotificacao('Erro ao enviar pedido. Tente novamente!');
    }
  }

  criarMensagemPedido() {
    const data = new Date().toLocaleString('pt-BR');
    let mensagem = `🍕 *PEDIDO - PIZZARIA BELLA ITALIA*\n\n`;
    mensagem += `📅 Data: ${data}\n\n`;
    mensagem += `📋 *ITENS DO PEDIDO:*\n\n`;

    this.itens.forEach(item => {
      const subtotal = (item.preco * item.quantidade).toFixed(2).replace('.', ',');
      
      // Determinar emoji baseado no tipo de item
      let emoji = '🍕'; // padrão para pizza
      if (item.nome.toLowerCase().includes('cerveja') || item.nome.toLowerCase().includes('vinho')) {
        emoji = '🍺';
      } else if (item.nome.toLowerCase().includes('refrigerante')) {
        emoji = '🥤';
      } else if (item.nome.toLowerCase().includes('água') || item.nome.toLowerCase().includes('agua')) {
        emoji = '💧';
      } else if (item.nome.toLowerCase().includes('suco')) {
        emoji = '🧃';
      }
      
      mensagem += `${emoji} *${item.quantidade}x ${item.nome}*\n`;
      
      // Adicionar especificações se houver
      if (item.especificacoes) {
        if (item.especificacoes.adicionais && item.especificacoes.adicionais.length > 0) {
          mensagem += `   ➕ *Adicionais:* ${item.especificacoes.adicionais.join(', ')}\n`;
        }
        if (item.especificacoes.removidos && item.especificacoes.removidos.length > 0) {
          mensagem += `   ➖ *Sem:* ${item.especificacoes.removidos.join(', ')}\n`;
        }
      }
      
      mensagem += `   💰 R$ ${item.preco.toFixed(2).replace('.', ',')} cada\n`;
      mensagem += `   📊 Subtotal: R$ ${subtotal}\n\n`;
    });

    // Adicionar informações de entrega
    if (this.tipoEntrega === 'entrega') {
      mensagem += `🚚 *TIPO DE ENTREGA:* Entrega\n\n`;
      const endereco = document.getElementById('endereco-input').value;
      const telefone = document.getElementById('telefone-input').value;
      const nome = document.getElementById('nome-entrega-input').value;
      const bairroText = this.bairro === 'bairro1' ? 'Bairro 1' : 'Bairro 2';
      
      // Verificar se é apartamento
      const isApartamento = document.getElementById('apartamento-check').checked;
      const bloco = document.getElementById('bloco-input').value;
      const apartamento = document.getElementById('apartamento-input').value;
      
      mensagem += `📍 *ENDEREÇO DE ENTREGA:*\n`;
      mensagem += `   👤 Nome: ${nome}\n`;
      mensagem += `   🏙️ Cidade: São Paulo\n`;
      mensagem += `   🏘️ Bairro: ${bairroText}\n`;
      mensagem += `   🏠 Endereço: ${endereco}`;
      
      if (isApartamento && bloco && apartamento) {
        mensagem += `\n   🏢 Bloco: ${bloco}`;
        mensagem += `\n   🏠 Apartamento: ${apartamento}`;
      }
      
      mensagem += `\n   📞 Telefone: ${telefone}\n\n`;
    } else {
      mensagem += `🏪 *TIPO DE ENTREGA:* Retirada no Local\n\n`;
      const nome = document.getElementById('nome-retirada-input').value;
      const telefone = document.getElementById('telefone-retirada-input').value;
      
      mensagem += `👤 *DADOS PARA RETIRADA:*\n`;
      mensagem += `   👤 Nome: ${nome}\n`;
      mensagem += `   📞 Telefone: ${telefone}\n\n`;
    }

    // Adicionar subtotal e taxa
    const subtotal = this.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    const totalFinal = this.tipoEntrega === 'entrega' ? subtotal + this.taxaEntrega : subtotal;
    
    mensagem += `💰 *RESUMO FINANCEIRO:*\n`;
    mensagem += `   📊 Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    
    if (this.tipoEntrega === 'entrega' && this.taxaEntrega > 0) {
      mensagem += `   🚚 Taxa de Entrega: R$ ${this.taxaEntrega.toFixed(2).replace('.', ',')}\n`;
    }
    
    mensagem += `   💵 *TOTAL: R$ ${totalFinal.toFixed(2).replace('.', ',')}*\n\n`;

    // Adicionar observações se houver
    if (this.observacoes.trim()) {
      mensagem += `📝 *OBSERVAÇÕES:*\n`;
      mensagem += `   ${this.observacoes}\n\n`;
    }

    // Adicionar forma de pagamento
    const pagamentoSelecionado = document.querySelector('input[name="pagamento"]:checked');
    if (pagamentoSelecionado) {
      mensagem += `💳 *FORMA DE PAGAMENTO:*\n`;
      
      switch (pagamentoSelecionado.value) {
        case 'pix':
          mensagem += `   📱 PIX (será enviado após confirmação)\n`;
          break;
        case 'dinheiro':
          const valorRecebido = document.getElementById('valor-recebido').value;
          const precisaTroco = document.getElementById('precisa-troco').checked;
          mensagem += `   💵 Dinheiro`;
          if (precisaTroco && valorRecebido) {
            const troco = parseFloat(valorRecebido) - totalFinal;
            mensagem += `\n   💰 Valor recebido: R$ ${parseFloat(valorRecebido).toFixed(2).replace('.', ',')}`;
            mensagem += `\n   🔄 Troco: R$ ${troco.toFixed(2).replace('.', ',')}`;
          }
          mensagem += `\n`;
          break;
        case 'cartao':
          const tipoCartao = document.getElementById('tipo-cartao').value;
          const bandeiraCartao = document.getElementById('bandeira-cartao').value;
          mensagem += `   💳 Cartão ${tipoCartao.charAt(0).toUpperCase() + tipoCartao.slice(1)}\n`;
          mensagem += `   🏦 Bandeira: ${bandeiraCartao.charAt(0).toUpperCase() + bandeiraCartao.slice(1)}\n`;
          break;
      }
    }

    mensagem += `\n🛵 *DELIVERY PARA TODA SÃO PAULO*`;

    return mensagem;
  }
}

// Inicializar o carrinho quando a página carregar
let carrinho;
document.addEventListener('DOMContentLoaded', () => {
  carrinho = new CarrinhoCompras();
  
  // Manter a animação original dos cards
  const cards = document.querySelectorAll('.pizza-card');
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add('show');
    }, 200 * i);
  });
});