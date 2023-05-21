import { Component, OnDestroy, OnInit } from '@angular/core';
import { Difficulty, NestedCategory, Question } from '../data.models';
import { first, map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { QuizService } from '../quiz.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { QuizUtilsService } from "../quiz-utils.service";
import { PerformanceUtils } from "../core/utils/performance.utils";

// Usually I use UntilDestroy (https://www.npmjs.com/package/@ngneat/until-destroy)
@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css']
})
export class QuizMakerComponent implements OnInit, OnDestroy {
  PerformanceUtils: typeof PerformanceUtils = PerformanceUtils;
  categories$: Observable<NestedCategory[]>;
  questions!: Question[];
  extraQuestion!: Question;
  form: FormGroup;
  selectedCategory: NestedCategory | undefined;
  controlType: 'dropdown' | 'autocomplete' = 'dropdown';

  private categories: NestedCategory[] = [];
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private quizService: QuizService,
    private formBuilder: FormBuilder,
    private quizUtilsService: QuizUtilsService
  ) {
    this.categories$ = quizService.getAllCategories().pipe(
      map(items => this.quizUtilsService.prepareCategories(items)),
      tap(items => this.categories = items)
    );
    this.form = this.getForm();
  }

  ngOnInit(): void {
    this.form.controls['category'].valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.selectedCategory = this.categories.find(category => category.id === +value);

      this.manageSubcategory();
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  createQuiz(): void {
    if (this.form.invalid) {
      // Here we can put some validations messages
      return;
    }

    const { category, subcategory, difficulty } = this.form.value;
    const id = subcategory || category;

    // Reset questions, to re-trigger component, and set defaults
    this.questions = [];

    // In task is indicated to make another call when user change question, to avoid extra call we can have initially 6
    this.quizService.createQuiz(id, difficulty as Difficulty, 6)
      .pipe(first())
      .subscribe(items => {
        const [firstQuestion, ...questions] = items;
        this.extraQuestion = firstQuestion;

        this.questions = questions;
      });
  }

  replaceQuestion(question: Question): void {
    // If request to API is needed we can do it here, but for now we just replace question to our extra question
    const index = this.questions.findIndex(item => item.question === question.question);

    this.questions[index] = this.extraQuestion;
  }

  private manageSubcategory(): void {
    if (this.selectedCategory?.subcategories.length) {
      this.form.addControl('subcategory', this.formBuilder.control(null, Validators.required));
    } else {
      this.form.removeControl('subcategory');
    }

    this.form.updateValueAndValidity();
  }

  private getForm(): FormGroup {
    return this.formBuilder.group({
      category: [null, Validators.required],
      difficulty: [null, Validators.required]
    });
  }
}
