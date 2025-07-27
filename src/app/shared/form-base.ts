import { FormGroup } from '@angular/forms';

/**
 * Classe base para formulários.
 *
 * Gerencia a lógica comum de manipulação de formulários (validação, controle de campos submetidos e exibição de mensagens de erro).
 *
 * As mensagens de erro são exibidas quando o formulário é submetido e removidas somente quando o usuário interage com cada campo individualmente.
 *
 * O método `submit` deve ser implementado nas classes derivadas para definir o que acontece quando o formulário é submetido com sucesso.
 */
export abstract class FormBase {
  protected invalidFields: Set<string>;

  /**
   * Gerencia o `form` passado juntamente com a lógica de validação e controle de campos submetidos.
   * @param form O formulário a ser gerenciado.
   * @param errorMessages Um objeto opcional contendo mensagens de erro personalizadas para os campos do formulário.
   */
  constructor(protected form: FormGroup, private errorMessages?: Record<string, Record<string, string>>) {
    this.invalidFields = new Set<string>();

    // Adiciona um listener para cada controle do formulário
    for (const key in this.form.controls) {
      const control = this.form.get(key);
      control?.valueChanges.subscribe(() => {
        this.invalidFields.delete(key);
      });
    }
  }

  /**
   * Verifica se um campo deve exibir uma mensagem de erro.
   * @param field O nome do campo a ser verificado.
   * @returns Verdadeiro se o campo deve mostrar um erro, falso caso contrário.
   */
  public checkError(field: string): boolean {
    return this.invalidFields.has(field) && this.form.get(field)?.invalid === true;
  }

  /**
   * Obtém a mensagem de erro para um campo específico.
   * @param field O nome do campo para o qual a mensagem de erro deve ser obtida.
   * @param fallback Uma mensagem de fallback a ser retornada se não houver mensagem de erro definida.
   * @returns A mensagem de erro ou null se não houver erro. Caso a mensagem de erro não esteja definida, retorna `fallback`.
   */
  public getErrorMessage(field: string, fallback: string='Invalid field'): string | null {
    const control = this.form.get(field);

    if (control?.errors) {
      const firstErrorKey = Object.keys(control.errors)[0];
      return this.errorMessages?.[field]?.[firstErrorKey] || fallback;
    }

    return null;
  }

  /**
   * Verifica os campos do formulário e adiciona os inválidos ao conjunto de campos submetidos.
   */
  protected checkFields() {
    for (const key in this.form.controls) {
      if (this.form.get(key)?.invalid) {
        this.invalidFields.add(key);
      }
    }
  }

  /**
   * Submete o formulário.
   *
   * Se o formulário for válido, chama o método `submit` que deve ser implementado.
   */
  public async submitForm() {
    this.checkFields();
    if (this.form.valid) {
      await this.submit();
    }
  }

  /**
   * Método abstrato que deve ser implementado nas classes derivadas.
   *
   * Deve conter a lógica de submissão do formulário.
   */
  protected abstract submit(): Promise<void>;
}
