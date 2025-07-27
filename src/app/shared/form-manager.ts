import { OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

/**
 * Gerencia a lógica comum de manipulação de formulários (validação, controle de campos submetidos e exibição de mensagens de erro).
 *
 * As mensagens de erro são exibidas quando o formulário é submetido e removidas somente quando o usuário interage com cada campo individualmente.
 *
 * O método `cleanUp` deve ser chamado quando o FormManager não for mais utilizado.
 */
export abstract class FormManager {
  public invalidFields = new Set<string>();
  private destroy$ = new Subject<void>();

  /**
   * Gerencia o `form` passado juntamente com a lógica de validação e controle de campos submetidos.
   * @param form O formulário a ser gerenciado.
   * @param errorMessages Um objeto opcional contendo mensagens de erro personalizadas para os campos do formulário.
   */
  constructor(public form: FormGroup, public errorMessages?: Record<string, Record<string, string>>, public formErrorMessages?: Record<string, string>) {
    // Adiciona um listener para cada controle do formulário
    for (const key in this.form.controls) {
      const control = this.form.get(key);
      control?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.invalidFields.delete(key);
      });
    }
  }

  /**
   * Limpa os recursos utilizados pelo FormManager.
   *
   * Deve ser chamado quando o FormManager não for mais utilizado.
   */
  public cleanUp(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
   * Define um erro para um campo específico (deve ser usado para erros customizados).
   * @param field O nome do campo para o qual o erro deve ser definido.
   * @param errorKey A chave do erro a ser definida para o campo.
   */
  public setError(field: string, errorKey: string): void {
    this.form.get(field)?.setErrors({ [errorKey]: true });
    this.invalidFields.add(field);
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
  public checkFields(): void {
    for (const key in this.form.controls) {
      if (this.form.get(key)?.invalid) {
        this.invalidFields.add(key);
      }
    }
  }

  /**
   * Verifica se o formulário está inválido.
   * @returns Verdadeiro se o formulário estiver inválido, falso caso contrário.
   */
  public checkFormError(): boolean {
    return this.form.invalid;
  }

  /**
   * Define um erro genérico para o formulário.
   * @param errorKey A chave do erro a ser definida para o formulário.
   */
  public setFormError(errorKey: string): void {
    if (this.formErrorMessages) {
      this.form.setErrors({ [errorKey]: true });
    }
  }

  /**
   * Obtém a mensagem de erro genérica do formulário.
   * @param fallback Uma mensagem de fallback a ser retornada se não houver mensagem de erro definida.
   * @returns A mensagem de erro ou null se não houver erro. Caso a mensagem de erro não esteja definida, retorna `fallback`.
   */
  public getFormErrorMessage(fallback: string = 'Invalid form'): string | null {
    if (this.formErrorMessages && this.form.errors) {
      const firstErrorKey = Object.keys(this.form.errors)[0];
      return this.formErrorMessages[firstErrorKey] || fallback;
    }

    return null;
  }
}
