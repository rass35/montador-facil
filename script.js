document.addEventListener('DOMContentLoaded', function() {
      // Elementos
      const form = document.getElementById('agendamentoForm');
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const progress = document.getElementById('progress');
      const steps = document.querySelectorAll('.step');
      const stepContents = document.querySelectorAll('.step-content');
      const novoAgendamentoBtn = document.getElementById('novoAgendamento');
      
      // Campos do formulário
      const nome = document.getElementById('nome');
      const telefone = document.getElementById('telefone');
      const municipio = document.getElementById('municipio');
      const bairro = document.getElementById('bairro');
      const endereco = document.getElementById('endereco');
      const complemento = document.getElementById('complemento');
      
      const agendamento = document.getElementById('agendamento');
      const horario = document.getElementById('horario');
      
      // Campos de resumo
      const summaryNome = document.getElementById('summary-nome');
      const summaryTelefone = document.getElementById('summary-telefone');
      const summaryEndereco = document.getElementById('summary-endereco');
      const summaryServico = document.getElementById('summary-servico');
      const summaryData = document.getElementById('summary-data');
      const summaryValor = document.getElementById('summary-valor');
      
      // Estado atual
      let currentStep = 1;
      const totalSteps = 4;
      
      // Número do WhatsApp que receberá os agendamentos (formato internacional sem o +)
      const numeroWhatsApp = "5521972654357"; // Substitua pelo número real
      
      // Atualizar progresso
      function updateProgress() {
        const progressWidth = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progress.style.width = `${progressWidth}%`;
        
        // Atualizar indicadores de etapa
        steps.forEach((step, index) => {
          if (index + 1 <= currentStep) {
            step.classList.add('active');
          } else {
            step.classList.remove('active');
          }
        });
        
        // Atualizar botões
        prevBtn.disabled = currentStep === 1;
        
        if (currentStep === totalSteps) {
          nextBtn.textContent = 'Confirmar';
          nextBtn.classList.add('whatsapp-btn');
          nextBtn.innerHTML = `
            <svg class="whatsapp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Confirmar no WhatsApp
          `;
        } else {
          nextBtn.textContent = 'Avançar';
          nextBtn.classList.remove('whatsapp-btn');
        }
        
        if (currentStep === 5) {
          prevBtn.style.display = 'none';
          nextBtn.style.display = 'none';
        } else {
          prevBtn.style.display = 'block';
          nextBtn.style.display = 'block';
        }
      }
      
      // Mostrar etapa atual
      function showStep(step) {
        stepContents.forEach(content => {
          content.classList.remove('active');
        });
        
        const activeContent = document.querySelector(`.step-content[data-step="${step}"]`);
        if (activeContent) {
          activeContent.classList.add('active');
        }
        
        // Se estiver na etapa de confirmação, preencher o resumo
        if (step === 4) {
          updateSummary();
        }
      }
      
      // Validar etapa atual
      function validateStep(step) {
        let isValid = true;
        
        // Resetar erros
        document.querySelectorAll('.error').forEach(error => {
          error.style.display = 'none';
        });
        
        document.querySelectorAll('input, select').forEach(input => {
          input.classList.remove('invalid');
        });
        
        switch(step) {
          case 1:
            if (!nome.value.trim()) {
              document.getElementById('nome-error').style.display = 'block';
              nome.classList.add('invalid');
              isValid = false;
            }
            
            if (!telefone.value.trim() || telefone.value.replace(/\D/g, '').length < 10) {
              document.getElementById('telefone-error').style.display = 'block';
              telefone.classList.add('invalid');
              isValid = false;
            }
            break;
            
          case 2:
            if (!municipio.value.trim()) {
              document.getElementById('municipio-error').style.display = 'block';
              municipio.classList.add('invalid');
              isValid = false;
            }
            
            if (!bairro.value.trim()) {
              document.getElementById('bairro-error').style.display = 'block';
              bairro.classList.add('invalid');
              isValid = false;
            }
            
            if (!endereco.value.trim()) {
              document.getElementById('endereco-error').style.display = 'block';
              endereco.classList.add('invalid');
              isValid = false;
            }
            break;
            
          case 3:
            if (!descricao.value) {
              document.getElementById('descricao-error').style.display = 'block';
              descricao.classList.add('invalid');
              isValid = false;
            }
            
            if (!agendamento.value) {
              document.getElementById('agendamento-error').style.display = 'block';
              agendamento.classList.add('invalid');
              isValid = false;
            }
            
            if (!horario.value) {
              document.getElementById('horario-error').style.display = 'block';
              horario.classList.add('invalid');
              isValid = false;
            }
            break;
        }
        
        return isValid;
      }
      
      // Atualizar resumo
      function updateSummary() {
        summaryNome.textContent = nome.value;
        summaryTelefone.textContent = telefone.value;
        
        let enderecoCompleto = `${endereco.value}, ${bairro.value}, ${municipio.value}`;
        if (complemento.value) {
          enderecoCompleto += ` - ${complemento.value}`;
        }
        summaryEndereco.textContent = enderecoCompleto;
        
        summaryServico.textContent = descricao.value.split(' - ')[0];
        
        // Formatar data
        const data = new Date(agendamento.value);
        const dia = data.getDate().toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const ano = data.getFullYear();
        
        summaryData.textContent = `${dia}/${mes}/${ano} às ${horario.value}`;
        
        // Extrair valor
        const valorMatch = descricao.value.match(/R\$ (\d+,\d+|\d+)/);
        if (valorMatch) {
          summaryValor.textContent = `R$ ${valorMatch[1]}`;
        }
      }
      
      // Formatar telefone
      telefone.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
          if (value.length > 2) {
            value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
          }
          if (value.length > 10) {
            value = `${value.substring(0, 10)}-${value.substring(10)}`;
          }
        }
        
        e.target.value = value;
      });
      
      // Definir data mínima como hoje
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      agendamento.min = `${yyyy}-${mm}-${dd}`;
      
      // Enviar para WhatsApp
      function enviarParaWhatsApp() {
        // Formatar data para exibição
        const data = new Date(agendamento.value);
        const dia = data.getDate().toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const ano = data.getFullYear();
        const dataFormatada = `${dia}/${mes}/${ano}`;
        
        const mensagem = `*Novo Agendamento Montador Fácil*\n\n*Nome:* ${nome.value}\n*Telefone:* ${telefone.value}\n*Município:* ${municipio.value}\n*Bairro:* ${bairro.value}\n*Endereço:* ${endereco.value}\n*Complemento:* ${complemento.value || 'Não informado'}\n*Data:* ${dataFormatada}\n*Horário:* ${horario.value}\n*Serviço:* ${descricao.value}`;

        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

        window.open(url, '_blank');
        
        // Mostrar tela de sucesso
        currentStep = 5;
        showStep(currentStep);
        updateProgress();
      }
      
      // Botão Avançar
      nextBtn.addEventListener('click', function() {
        if (currentStep === totalSteps) {
          // Enviar para WhatsApp
          if (validateStep(currentStep)) {
            enviarParaWhatsApp();
          }
          return;
        }
        
        if (validateStep(currentStep)) {
          currentStep++;
          showStep(currentStep);
          updateProgress();
        }
      });
      
      // Botão Voltar
      prevBtn.addEventListener('click', function() {
        if (currentStep > 1) {
          currentStep--;
          showStep(currentStep);
          updateProgress();
        }
      });
      
      // Botão Novo Agendamento
      novoAgendamentoBtn.addEventListener('click', function() {
        form.reset();
        currentStep = 1;
        showStep(currentStep);
        updateProgress();
      });
      
      // Inicializar
      updateProgress();
      showStep(currentStep);
    });
function calcularTotal() {
  const servicos = document.querySelectorAll('.servico');
  let total = 0;
  let resumo = "";

  servicos.forEach((checkbox) => {
    const qtdInput = checkbox.closest('.item-servico').querySelector('.quantidade');
    if (checkbox.checked) {
      const preco = parseFloat(checkbox.dataset.valor);
      const qtd = parseInt(qtdInput.value) || 1;
      const nome = checkbox.dataset.label;
      total += preco * qtd;
      resumo += `\n- ${nome} (x${qtd})`;
    }
  });

  document.getElementById('valor-total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

document.querySelectorAll('.servico').forEach((checkbox) => {
  const qtdInput = checkbox.closest('.item-servico').querySelector('.quantidade');
  checkbox.addEventListener('change', function () {
    qtdInput.disabled = !this.checked;
    calcularTotal();
  });
});

document.querySelectorAll('.quantidade').forEach((input) => {
  input.addEventListener('input', calcularTotal);
});
